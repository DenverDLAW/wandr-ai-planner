import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildItineraryPrompt } from '@/lib/ai/claude'
import { extractJson, repairTruncatedJson } from '@/lib/json-utils'
import { createClient } from '@/lib/supabase/server'
import { TripInputsSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import type { GeneratedItinerary } from '@/types/itinerary'

const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY environment variable')
const anthropic = new Anthropic({ apiKey })

export const maxDuration = 60

// 10 generations per hour per user — enough for real use, too slow to abuse
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000

export async function POST(req: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Rate limiting ───────────────────────────────────────────────────────────
  if (!rateLimit(user.id, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: 'Too many requests — please wait before generating another itinerary' },
      { status: 429 }
    )
  }

  // ── Input validation ────────────────────────────────────────────────────────
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = TripInputsSchema.safeParse((body as { inputs?: unknown })?.inputs)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid trip inputs', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const inputs = parsed.data
  const prompt = buildItineraryPrompt(inputs)
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }
      // SSE comment heartbeat — keeps the Vercel connection alive during generation
      const ping = () => controller.enqueue(encoder.encode(': ping\n\n'))

      try {
        ping() // immediate ping so Vercel sees a live streaming response

        let fullText = ''
        let tokenCount = 0

        const claudeStream = anthropic.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 8000,
          messages: [{ role: 'user', content: prompt }],
        })

        // Pipe each token AND send pings every 10 tokens to stay within Vercel's
        // streaming-response-duration limit (300s) rather than the 60s exec timeout
        for await (const chunk of claudeStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            fullText += chunk.delta.text
            tokenCount++
            if (tokenCount % 10 === 0) ping()
          }
        }

        const jsonStr = extractJson(fullText)
        if (!jsonStr) {
          console.error('generate-itinerary: no JSON found in AI response')
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
            console.error('generate-itinerary: JSON repair failed:', repairError)
            send({ type: 'error', error: 'Could not parse itinerary from AI response' })
            controller.close()
            return
          }
        }

        if (!Array.isArray(itineraryData.days)) itineraryData.days = []
        if (!Array.isArray(itineraryData.flights)) itineraryData.flights = []
        if (!Array.isArray(itineraryData.accommodation)) itineraryData.accommodation = []

        // Fire-and-forget: save to Supabase without blocking the response.
        // Errors are logged but non-fatal — the itinerary has already been returned.
        void (async () => {
          try {
            const { data: trip, error: tripError } = await supabase
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
            if (tripError) {
              console.error('generate-itinerary: failed to save trip:', tripError.message)
              return
            }
            if (trip) {
              const { error: itinError } = await supabase.from('itineraries').insert({
                trip_id: trip.id,
                user_id: user.id,
                raw_json: itineraryData,
                summary: itineraryData.summary,
                total_cost_estimate_usd: itineraryData.totalCostEstimateUsd,
              })
              if (itinError) {
                console.error('generate-itinerary: failed to save itinerary:', itinError.message)
              }
            }
          } catch (saveError) {
            console.error('generate-itinerary: unexpected save error:', saveError)
          }
        })()

        send({ type: 'done', itinerary: itineraryData })
        controller.close()
      } catch (error) {
        console.error('generate-itinerary: stream error:', error)
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
