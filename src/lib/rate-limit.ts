/**
 * Simple in-memory rate limiter.
 * Per-instance only — sufficient for a single-server or low-traffic Vercel deployment.
 * For multi-instance production scale, replace with Upstash Redis.
 */

const store = new Map<string, number[]>()

/**
 * Returns true if the request should be allowed, false if rate-limited.
 * @param key      Unique identifier (e.g. user ID or IP address)
 * @param limit    Maximum number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = store.get(key) ?? []

  // Keep only timestamps within the current window
  const recent = timestamps.filter((t) => now - t < windowMs)

  if (recent.length >= limit) return false

  recent.push(now)
  store.set(key, recent)
  return true
}
