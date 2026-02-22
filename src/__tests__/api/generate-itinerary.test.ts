import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mock Anthropic SDK ────────────────────────────────────────────────────────
// Must use a regular function (not arrow) so it can be called with `new`.
vi.mock('@anthropic-ai/sdk', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: vi.fn(function (this: any) {
    this.messages = { stream: vi.fn() }
  }),
}))

// ── Mock Supabase — use vi.hoisted() so the fn is available inside vi.mock() ─
const { mockGetUser } = vi.hoisted(() => ({ mockGetUser: vi.fn() }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: mockGetUser },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  }),
}))

import { POST } from '@/app/api/generate-itinerary/route'
import { rateLimit } from '@/lib/rate-limit'

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/generate-itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validInputs = {
  plannerName: 'Drew',
  startDate: '2025-06-01',
  endDate: '2025-06-07',
  categories: ['beach'],
  budgetRange: '2k-5k',
  travelers: 'couple',
}

describe('POST /api/generate-itinerary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('auth guard', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } })
      const res = await POST(makeRequest({ inputs: validInputs }))
      expect(res.status).toBe(401)
      const body = await res.json()
      expect(body.error).toBe('Unauthorized')
    })
  })

  describe('input validation', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    })

    it('returns 400 for invalid JSON body', async () => {
      const req = new NextRequest('http://localhost/api/generate-itinerary', {
        method: 'POST',
        body: 'not-json',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })

    it('returns 400 when inputs are missing entirely', async () => {
      const res = await POST(makeRequest({}))
      expect(res.status).toBe(400)
    })

    it('returns 400 when plannerName is empty', async () => {
      const res = await POST(makeRequest({ inputs: { ...validInputs, plannerName: '' } }))
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.details?.plannerName).toBeDefined()
    })

    it('returns 400 for invalid startDate format', async () => {
      const res = await POST(makeRequest({ inputs: { ...validInputs, startDate: 'June 1 2025' } }))
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.details?.startDate).toBeDefined()
    })

    it('returns 400 for invalid endDate format', async () => {
      const res = await POST(makeRequest({ inputs: { ...validInputs, endDate: '01/06/2025' } }))
      expect(res.status).toBe(400)
    })

    it('returns 400 when endDate is before startDate', async () => {
      const res = await POST(makeRequest({
        inputs: { ...validInputs, startDate: '2025-06-10', endDate: '2025-06-01' },
      }))
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.details?.endDate).toBeDefined()
    })

    it('returns 400 for an unknown category', async () => {
      const res = await POST(makeRequest({ inputs: { ...validInputs, categories: ['cruise'] } }))
      expect(res.status).toBe(400)
    })

    it('returns 400 for an unknown budgetRange', async () => {
      const res = await POST(makeRequest({ inputs: { ...validInputs, budgetRange: 'free' } }))
      expect(res.status).toBe(400)
    })

    it('returns 400 for an unknown travelers value', async () => {
      const res = await POST(makeRequest({ inputs: { ...validInputs, travelers: 'family' } }))
      expect(res.status).toBe(400)
    })

    it('returns 400 when categories array is empty', async () => {
      const res = await POST(makeRequest({ inputs: { ...validInputs, categories: [] } }))
      expect(res.status).toBe(400)
    })
  })

  describe('rate limiting', () => {
    it('returns 429 after exceeding 10 requests per hour', async () => {
      const userId = `rate-limit-test-${Date.now()}`
      mockGetUser.mockResolvedValue({ data: { user: { id: userId } } })

      for (let i = 0; i < 10; i++) {
        rateLimit(userId, 10, 60 * 60 * 1000)
      }

      const res = await POST(makeRequest({ inputs: validInputs }))
      expect(res.status).toBe(429)
      const body = await res.json()
      expect(body.error).toContain('Too many requests')
    })
  })
})
