import { describe, it, expect, vi, afterEach } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

afterEach(() => {
  vi.useRealTimers()
})

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const key = `test-allow-${Date.now()}`
    expect(rateLimit(key, 3, 60_000)).toBe(true)
    expect(rateLimit(key, 3, 60_000)).toBe(true)
    expect(rateLimit(key, 3, 60_000)).toBe(true)
  })

  it('blocks the request that exceeds the limit', () => {
    const key = `test-block-${Date.now()}`
    rateLimit(key, 2, 60_000)
    rateLimit(key, 2, 60_000)
    expect(rateLimit(key, 2, 60_000)).toBe(false)
  })

  it('isolates limits per key', () => {
    const keyA = `test-iso-a-${Date.now()}`
    const keyB = `test-iso-b-${Date.now()}`
    rateLimit(keyA, 1, 60_000)
    expect(rateLimit(keyA, 1, 60_000)).toBe(false)
    expect(rateLimit(keyB, 1, 60_000)).toBe(true)
  })

  it('allows requests again after the window expires', () => {
    vi.useFakeTimers()
    const key = `test-window-${Date.now()}`
    rateLimit(key, 1, 1_000) // fill the limit
    expect(rateLimit(key, 1, 1_000)).toBe(false)

    vi.advanceTimersByTime(1_001) // move past the window
    expect(rateLimit(key, 1, 1_000)).toBe(true)
  })
})
