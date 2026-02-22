'use client'

import { useState, useEffect } from 'react'

// Module-level caches survive re-renders and are shared across all hook instances.
// Same keyword → single network round-trip no matter how many components call this.
const resolved = new Map<string, string | null>()
const inFlight = new Map<string, Promise<string | null>>()

function fetchImage(keywords: string): Promise<string | null> {
  const existing = inFlight.get(keywords)
  if (existing) return existing

  const request = fetch(`/api/images?q=${encodeURIComponent(keywords)}`)
    .then((r) => r.json())
    .then((data) => (data.url ?? null) as string | null)
    .catch(() => null)
    .finally(() => inFlight.delete(keywords))

  inFlight.set(keywords, request)
  return request
}

interface PexelsImageResult {
  url: string | null
  loading: boolean
}

export function usePexelsImage(keywords: string | undefined): PexelsImageResult {
  const alreadyResolved = !!keywords && resolved.has(keywords)

  const [url, setUrl] = useState<string | null>(() =>
    keywords ? (resolved.get(keywords) ?? null) : null
  )
  const [loading, setLoading] = useState(!alreadyResolved && !!keywords)

  useEffect(() => {
    if (!keywords) return

    // Already in cache — serve instantly, no network call
    if (resolved.has(keywords)) {
      setUrl(resolved.get(keywords) ?? null)
      setLoading(false)
      return
    }

    setLoading(true)
    let cancelled = false
    fetchImage(keywords).then((result) => {
      resolved.set(keywords, result)
      if (!cancelled) {
        setUrl(result)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [keywords])

  return { url, loading }
}
