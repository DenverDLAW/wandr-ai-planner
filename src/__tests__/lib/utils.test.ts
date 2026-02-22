import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional falsy values', () => {
    expect(cn('foo', false && 'bar', null, undefined, 'baz')).toBe('foo baz')
  })

  it('merges conflicting Tailwind classes (last wins)', () => {
    // tailwind-merge should resolve p-2 vs p-4 → p-4
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('deduplicates identical classes', () => {
    expect(cn('text-sm', 'text-sm')).toBe('text-sm')
  })

  it('handles an empty call', () => {
    expect(cn()).toBe('')
  })

  it('handles an array-like spread of conditionals', () => {
    const active = true
    expect(cn('base', active ? 'active' : 'inactive')).toBe('base active')
  })
})
