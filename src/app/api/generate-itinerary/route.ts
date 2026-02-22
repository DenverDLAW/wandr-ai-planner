import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildItineraryPrompt } from '@/lib/ai/claude'
import { createClient } from '@/lib/supabase/server'
import type { TripInputs } from '@/types/planner'
import type { GeneratedItinerary } from '@/types/itinerary'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const maxDuration = 60

// Extract JSON from Claude's response (fenced block or bare object)
function extractJson(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (fenced) return fenced[1].trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1)
  return null
}

// Close any unclosed brackets/braces caused by output truncation
function repairTruncatedJson(jsonStr: string): string {
  const stack: string[] = []
  let inString = false
  let escape = false

  for (const ch of jsonStr) {
    if (escape) { escape = false; continue }
    if (ch === '\\' && inString) { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{' || ch === '[') stack.push(ch === '{' ? '}' : ']')
    else if ((ch === '}' || ch === ']') && stack.length) stack.pop()
  }

  if (stack.length === 0) return jsonStr

  // Strip any trailing incomplete property (e.g., `,"key": ` with no value)
  const trimmed = jsonStr.replace(/,?\s*"[^"]*"\s*:\s*$/, '')
    .replace(/,\s*$/, '') // trailing comma

  return trimmed + stack.reverse().join('')
}

export async function POST(req: NextRequest) {
  try {
    const body: { inputs: TripInputs } = await req.json()
    const { inputs } = body

    if (!inputs?.plannerName || !inputs?.startDate || !inputs?.endDate) {
      return NextResponse.json({ error: 'Missing required trip inputs' }, { status: 400 })
    }

    const prompt = buildItineraryPrompt(inputs)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 20000,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawContent = message.content[0]
    if (rawContent.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response from AI' }, { status: 500 })
    }

    const jsonStr = extractJson(rawContent.text)
    if (!jsonStr) {
      console.error('No JSON found. Response start:', rawContent.text.slice(0, 300))
      return NextResponse.json({ error: 'Could not parse itinerary from AI response' }, { status: 500 })
    }

    let itineraryData: GeneratedItinerary

    // First try parsing as-is
    try {
      itineraryData = JSON.parse(jsonStr)
    } catch {
      // Response was likely truncated — attempt repair
      console.warn('JSON parse failed, attempting repair. stop_reason:', message.stop_reason)
      try {
        const repaired = repairTruncatedJson(jsonStr)
        itineraryData = JSON.parse(repaired)
        console.log('JSON repair succeeded')
      } catch (repairError) {
        console.error('JSON repair also failed:', repairError, '\nJSON start:', jsonStr.slice(0, 400))
        return NextResponse.json({ error: 'Could not parse itinerary from AI response' }, { status: 500 })
      }
    }

    // Ensure required arrays exist (repair may have dropped the last day)
    if (!Array.isArray(itineraryData.days)) itineraryData.days = []
    if (!Array.isArray(itineraryData.flights)) itineraryData.flights = []
    if (!Array.isArray(itineraryData.accommodation)) itineraryData.accommodation = []

    // Fire-and-forget: save to Supabase without blocking the response
    void (async () => {
      try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: trip } = await supabase
            .from('trips')
            .insert({
              user_id: user.id,
              title: itineraryData.title,
              destination: itineraryData.destination,
              categories: inputs.categories,
              budget_range: inputs.budgetRange,
              traveler_count: inputs.travelers,
              start_date: itineraryData.startDate,
              end_date: itineraryData.endDate,
              planner_name: inputs.plannerName,
              status: 'generated',
            })
            .select()
            .single()
          if (trip) {
            await supabase.from('itineraries').insert({
              trip_id: trip.id,
              user_id: user.id,
              raw_json: itineraryData,
              summary: itineraryData.summary,
              total_cost_estimate_usd: itineraryData.totalCostEstimateUsd,
            })
          }
        }
      } catch { /* non-fatal */ }
    })()

    return NextResponse.json({ itinerary: itineraryData })
  } catch (error) {
    console.error('generate-itinerary error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
