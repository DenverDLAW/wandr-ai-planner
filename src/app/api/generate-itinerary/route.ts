import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildItineraryPrompt } from '@/lib/ai/claude'
import { createClient } from '@/lib/supabase/server'
import type { TripInputs } from '@/types/planner'
import type { GeneratedItinerary } from '@/types/itinerary'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY?.trim() })

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

  const trimmed = jsonStr.replace(/,?\s*"[^"]*"\s*:\s*$/, '')
    .replace(/,\s*$/, '')

  return trimmed + stack.reverse().join('')
}

export async function POST(req: NextRequest) {
  let inputs: TripInputs

  try {
    const body: { inputs: TripInputs } = await req.json()
    inputs = body.inputs
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!inputs?.plannerName || !inputs?.startDate || !inputs?.endDate) {
    return Response.json({ error: 'Missing required trip inputs' }, { status: 400 })
  }

  const prompt = buildItineraryPrompt(inputs)
  const encoder = new TextEncoder()

  // Stream SSE so Vercel sees active data flow and doesn't time out
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      try {
        // Ping immediately — this tells Vercel the function is alive
        send({ type: 'start' })

        // Stream tokens from Claude
        let fullText = ''
        const claudeStream = anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 20000,
          messages: [{ role: 'user', content: prompt }],
        })

        for await (const chunk of claudeStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            fullText += chunk.delta.text
          }
        }

        // Parse the complete response
        const jsonStr = extractJson(fullText)
        if (!jsonStr) {
          console.error('No JSON found. Response start:', fullText.slice(0, 300))
          send({ type: 'error', error: 'Could not parse itinerary from AI response' })
          controller.close()
          return
        }

        let itineraryData: GeneratedItinerary
        try {
          itineraryData = JSON.parse(jsonStr)
        } catch {
          try {
            const repaired = repairTruncatedJson(jsonStr)
            itineraryData = JSON.parse(repaired)
          } catch (repairError) {
            console.error('JSON repair failed:', repairError)
            send({ type: 'error', error: 'Could not parse itinerary from AI response' })
            controller.close()
            return
          }
        }

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

        send({ type: 'done', itinerary: itineraryData })
        controller.close()
      } catch (error) {
        console.error('generate-itinerary error:', error)
        send({ type: 'error', error: 'Internal server error' })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
