import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ItineraryPdfDocument } from '@/lib/pdf/itinerary-pdf'
import { fetchImageAsBase64, fetchPexelsImageFull, pLimit } from '@/lib/images'
import type { GeneratedItinerary } from '@/types/itinerary'
import React from 'react'

async function keywordsToBase64(keywords: string | undefined): Promise<string | null> {
  if (!keywords) return null
  try {
    const url = await fetchPexelsImageFull(keywords)
    if (!url) return null
    return await fetchImageAsBase64(url)
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { itinerary, plannerName }: { itinerary: GeneratedItinerary; plannerName: string } =
      await req.json()

    // Collect every image task into a single flat list, then run with concurrency cap.
    // Prevents sending hundreds of simultaneous requests that overwhelm Pexels or spike memory.
    const allItems = itinerary.days.flatMap((day) => [
      ...day.morning.items,
      ...day.afternoon.items,
      ...day.evening.items,
    ])

    type ImageTask =
      | { kind: 'cover' }
      | { kind: 'day'; idx: number }
      | { kind: 'hotel'; idx: number }
      | { kind: 'activity'; id: string; keywords: string }

    const imageTasks: ImageTask[] = [
      { kind: 'cover' },
      ...itinerary.days.map((_, idx) => ({ kind: 'day' as const, idx })),
      ...itinerary.accommodation.map((_, idx) => ({ kind: 'hotel' as const, idx })),
      ...allItems.map((item) => ({ kind: 'activity' as const, id: item.id, keywords: item.imageKeywords })),
    ]

    let coverImageBase64: string | null = null
    const dayImagesBase64: Array<string | null> = new Array(itinerary.days.length).fill(null)
    const hotelImagesBase64: Array<string | null> = new Array(itinerary.accommodation.length).fill(null)
    const activityImages = new Map<string, string | null>()

    await pLimit(
      imageTasks.map((task) => async () => {
        if (task.kind === 'cover') {
          coverImageBase64 = await keywordsToBase64(itinerary.imageKeywords)
        } else if (task.kind === 'day') {
          dayImagesBase64[task.idx] = await keywordsToBase64(itinerary.days[task.idx].imageKeywords)
        } else if (task.kind === 'hotel') {
          hotelImagesBase64[task.idx] = await keywordsToBase64(itinerary.accommodation[task.idx].imageKeywords)
        } else {
          activityImages.set(task.id, await keywordsToBase64(task.keywords))
        }
      }),
      5 // max 5 concurrent Pexels + image-download requests
    )

    const element = React.createElement(ItineraryPdfDocument, {
      itinerary,
      plannerName,
      coverImageBase64,
      dayImagesBase64,
      hotelImagesBase64,
      activityImages,
    }) as unknown as Parameters<typeof renderToBuffer>[0]

    const buffer = await renderToBuffer(element)

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${itinerary.destinationCity.replace(/\s+/g, '-')}-itinerary.pdf"`,
      },
    })
  } catch (error) {
    console.error('generate-pdf error:', error)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
