import { describe, it, expect } from 'vitest'
import { TripInputsSchema } from '@/lib/validation'

const valid = {
  plannerName: 'Drew',
  startDate: '2025-06-01',
  endDate: '2025-06-07',
  categories: ['beach'],
  budgetRange: '2k-5k',
  travelers: 'couple',
}

describe('TripInputsSchema', () => {
  it('accepts a fully valid input', () => {
    expect(TripInputsSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts same-day trips (startDate === endDate)', () => {
    const result = TripInputsSchema.safeParse({ ...valid, startDate: '2025-06-01', endDate: '2025-06-01' })
    expect(result.success).toBe(true)
  })

  it('accepts all valid categories', () => {
    const categories = ['beach', 'mountains', 'adventure', 'ski', 'city', 'water-sports', 'safari', 'road-trip']
    const result = TripInputsSchema.safeParse({ ...valid, categories })
    expect(result.success).toBe(true)
  })

  it('accepts all valid budgetRange values', () => {
    for (const br of ['under-1k', '1k-2k', '2k-5k', '5k-10k', '10k-plus']) {
      expect(TripInputsSchema.safeParse({ ...valid, budgetRange: br }).success).toBe(true)
    }
  })

  it('accepts all valid travelers values', () => {
    for (const t of ['solo', 'couple', 'small-group', 'large-group']) {
      expect(TripInputsSchema.safeParse({ ...valid, travelers: t }).success).toBe(true)
    }
  })

  it('rejects empty plannerName', () => {
    const result = TripInputsSchema.safeParse({ ...valid, plannerName: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.flatten().fieldErrors.plannerName).toBeDefined()
  })

  it('rejects plannerName over 100 characters', () => {
    const result = TripInputsSchema.safeParse({ ...valid, plannerName: 'A'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects startDate in wrong format (MM/DD/YYYY)', () => {
    const result = TripInputsSchema.safeParse({ ...valid, startDate: '06/01/2025' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.flatten().fieldErrors.startDate).toBeDefined()
  })

  it('rejects endDate in wrong format (natural language)', () => {
    const result = TripInputsSchema.safeParse({ ...valid, endDate: 'June 7 2025' })
    expect(result.success).toBe(false)
  })

  it('rejects endDate before startDate', () => {
    const result = TripInputsSchema.safeParse({ ...valid, startDate: '2025-06-10', endDate: '2025-06-01' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.flatten().fieldErrors.endDate).toBeDefined()
  })

  it('rejects empty categories array', () => {
    const result = TripInputsSchema.safeParse({ ...valid, categories: [] })
    expect(result.success).toBe(false)
  })

  it('rejects unknown category', () => {
    const result = TripInputsSchema.safeParse({ ...valid, categories: ['cruise'] })
    expect(result.success).toBe(false)
  })

  it('rejects unknown budgetRange', () => {
    const result = TripInputsSchema.safeParse({ ...valid, budgetRange: 'free' })
    expect(result.success).toBe(false)
  })

  it('rejects unknown travelers value', () => {
    const result = TripInputsSchema.safeParse({ ...valid, travelers: 'family' })
    expect(result.success).toBe(false)
  })
})
