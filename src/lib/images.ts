import type { GeneratedItinerary } from '@/types/itinerary'

const PEXELS_API_KEY = process.env.PEXELS_API_KEY

/**
 * Concurrency limiter — runs at most `concurrency` tasks simultaneously.
 * Prevents flooding Pexels with hundreds of parallel requests.
 */
export async function pLimit<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length)
  let next = 0
  async function worker() {
    while (next < tasks.length) {
      const idx = next++
      results[idx] = await tasks[idx]()
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, tasks.length) }, worker)
  )
  return results
}

async function pexelsSearch(query: string, size: 'large' | 'original' = 'large'): Promise<string | null> {
  if (!PEXELS_API_KEY) return null
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      {
        headers: { Authorization: PEXELS_API_KEY },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000), // never hang more than 5 s
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const photos = data.photos ?? []
    if (photos.length === 0) return null
    return photos[0]?.src?.[size] ?? null
  } catch {
    return null
  }
}

export async function fetchPexelsImage(keyword: string): Promise<string | null> {
  if (!PEXELS_API_KEY) {
    console.warn('PEXELS_API_KEY not set — skipping image fetch')
    return null
  }
  try {
    // Try full specific query first (e.g. "Four Seasons Bali Sayan pool")
    const specific = await pexelsSearch(keyword, 'large')
    if (specific) return specific

    // Fallback: use only the last 2-3 words (broader category search)
    const words = keyword.trim().split(/\s+/)
    const fallbackQuery = words.slice(-3).join(' ')
    return await pexelsSearch(fallbackQuery, 'large')
  } catch {
    return null
  }
}

export async function fetchPexelsImageFull(keyword: string): Promise<string | null> {
  if (!PEXELS_API_KEY) return null
  try {
    const specific = await pexelsSearch(keyword, 'original')
    if (specific) return specific
    const words = keyword.trim().split(/\s+/)
    return await pexelsSearch(words.slice(-3).join(' '), 'original')
  } catch {
    return null
  }
}

export async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const mimeType = res.headers.get('content-type') ?? 'image/jpeg'
  return `data:${mimeType};base64,${base64}`
}

// Batch resolve all imageKeywords → imageUrls across the full itinerary tree
export async function hydrateItineraryImages(
  itinerary: GeneratedItinerary
): Promise<GeneratedItinerary> {
  const tasks: Array<{ path: string; keyword: string }> = []

  tasks.push({ path: 'root', keyword: itinerary.imageKeywords })

  itinerary.flights.forEach((f, i) => {
    tasks.push({ path: `flight.${i}`, keyword: f.imageKeywords })
  })
  itinerary.accommodation.forEach((a, i) => {
    tasks.push({ path: `accommodation.${i}`, keyword: a.imageKeywords })
  })
  itinerary.days.forEach((d, i) => {
    tasks.push({ path: `day.${i}`, keyword: d.imageKeywords })
    d.morning.items.forEach((item, j) => {
      tasks.push({ path: `day.${i}.morning.${j}`, keyword: item.imageKeywords })
    })
    d.afternoon.items.forEach((item, j) => {
      tasks.push({ path: `day.${i}.afternoon.${j}`, keyword: item.imageKeywords })
    })
    d.evening.items.forEach((item, j) => {
      tasks.push({ path: `day.${i}.evening.${j}`, keyword: item.imageKeywords })
    })
  })

  // Cap at 6 simultaneous Pexels requests to avoid rate-limit 429s
  const results = await pLimit(
    tasks.map((t) => async () => ({ path: t.path, url: await fetchPexelsImage(t.keyword) })),
    6
  )

  const urlMap = new Map(results.map((r) => [r.path, r.url]))

  const hydrated: GeneratedItinerary = {
    ...itinerary,
    imageUrl: urlMap.get('root') ?? undefined,
    flights: itinerary.flights.map((f, i) => ({
      ...f,
      imageUrl: urlMap.get(`flight.${i}`) ?? undefined,
    })),
    accommodation: itinerary.accommodation.map((a, i) => ({
      ...a,
      imageUrl: urlMap.get(`accommodation.${i}`) ?? undefined,
    })),
    days: itinerary.days.map((d, i) => ({
      ...d,
      imageUrl: urlMap.get(`day.${i}`) ?? undefined,
      morning: {
        ...d.morning,
        items: d.morning.items.map((item, j) => ({
          ...item,
          imageUrl: urlMap.get(`day.${i}.morning.${j}`) ?? undefined,
        })),
      },
      afternoon: {
        ...d.afternoon,
        items: d.afternoon.items.map((item, j) => ({
          ...item,
          imageUrl: urlMap.get(`day.${i}.afternoon.${j}`) ?? undefined,
        })),
      },
      evening: {
        ...d.evening,
        items: d.evening.items.map((item, j) => ({
          ...item,
          imageUrl: urlMap.get(`day.${i}.evening.${j}`) ?? undefined,
        })),
      },
    })),
  }

  return hydrated
}

// Static category image keywords for the planner UI
export const CATEGORY_IMAGE_KEYWORDS: Record<string, string> = {
  'beach': 'tropical beach ocean paradise',
  'mountains': 'mountain peak hiking trail scenic',
  'adventure': 'adventure outdoor jungle canyon explore',
  'ski': 'ski resort snow slopes winter',
  'city': 'city skyline urban architecture travel',
  'water-sports': 'surfing ocean waves water sports',
  'safari': 'african safari wildlife elephant savanna',
  'road-trip': 'scenic highway road trip landscape',
}
