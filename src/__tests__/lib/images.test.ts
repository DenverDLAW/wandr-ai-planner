import { describe, it, expect } from 'vitest'
import { pLimit } from '@/lib/images'

describe('pLimit', () => {
  it('runs all tasks and returns results in order', async () => {
    const tasks = [1, 2, 3, 4, 5].map((n) => async () => n * 2)
    const results = await pLimit(tasks, 3)
    expect(results).toEqual([2, 4, 6, 8, 10])
  })

  it('handles an empty task list', async () => {
    const results = await pLimit([], 3)
    expect(results).toEqual([])
  })

  it('handles concurrency larger than task count', async () => {
    const tasks = [async () => 'a', async () => 'b']
    const results = await pLimit(tasks, 10)
    expect(results).toEqual(['a', 'b'])
  })

  it('respects concurrency — runs at most N tasks simultaneously', async () => {
    let active = 0
    let maxActive = 0

    const tasks = Array.from({ length: 10 }, (_, i) => async () => {
      active++
      maxActive = Math.max(maxActive, active)
      // simulate async work
      await new Promise((r) => setTimeout(r, 10))
      active--
      return i
    })

    await pLimit(tasks, 3)
    expect(maxActive).toBeLessThanOrEqual(3)
  })

  it('preserves result order regardless of completion order', async () => {
    // Task 0 takes longer than task 1 — result[0] should still be 0
    const tasks = [
      async () => { await new Promise((r) => setTimeout(r, 30)); return 0 },
      async () => { await new Promise((r) => setTimeout(r, 5));  return 1 },
      async () => { await new Promise((r) => setTimeout(r, 15)); return 2 },
    ]
    const results = await pLimit(tasks, 3)
    expect(results).toEqual([0, 1, 2])
  })
})
