import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mock Pexels lib — use vi.hoisted() so the fn is available inside vi.mock() ─
const { mockFetchPexelsImage } = vi.hoisted(() => ({ mockFetchPexelsImage: vi.fn() }))

vi.mock('@/lib/images', () => ({
  fetchPexelsImage: mockFetchPexelsImage,
}))

import { GET } from '@/app/api/images/route'

function makeRequest(query?: string) {
  const url = query
    ? `http://localhost/api/images?q=${encodeURIComponent(query)}`
    : 'http://localhost/api/images'
  return new NextRequest(url)
}

describe('GET /api/images', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns { url: null } when no query param is provided', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ url: null })
  })

  it('returns 400 when query exceeds 200 characters', async () => {
    const longQuery = 'a'.repeat(201)
    const res = await GET(makeRequest(longQuery))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Query too long')
  })

  it('accepts a query of exactly 200 characters', async () => {
    const maxQuery = 'a'.repeat(200)
    mockFetchPexelsImage.mockResolvedValueOnce('https://images.pexels.com/photo.jpg')
    const res = await GET(makeRequest(maxQuery))
    expect(res.status).toBe(200)
  })

  it('returns the image URL from Pexels on success', async () => {
    mockFetchPexelsImage.mockResolvedValueOnce('https://images.pexels.com/photos/123/photo.jpg')
    const res = await GET(makeRequest('Bali beach sunset'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.url).toBe('https://images.pexels.com/photos/123/photo.jpg')
  })

  it('returns { url: null } when Pexels returns null', async () => {
    mockFetchPexelsImage.mockResolvedValueOnce(null)
    const res = await GET(makeRequest('xyzzy nonexistent place'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ url: null })
  })

  it('passes the query string to fetchPexelsImage', async () => {
    mockFetchPexelsImage.mockResolvedValueOnce(null)
    await GET(makeRequest('Tokyo skyline night'))
    expect(mockFetchPexelsImage).toHaveBeenCalledWith('Tokyo skyline night')
  })
})
