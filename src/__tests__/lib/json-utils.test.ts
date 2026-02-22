import { describe, it, expect } from 'vitest'
import { extractJson, repairTruncatedJson } from '@/lib/json-utils'

describe('extractJson', () => {
  it('extracts JSON from a fenced ```json block', () => {
    const input = 'Here is your result:\n```json\n{"foo":"bar"}\n```'
    expect(extractJson(input)).toBe('{"foo":"bar"}')
  })

  it('extracts JSON from a plain ``` block', () => {
    const input = '```\n{"a":1}\n```'
    expect(extractJson(input)).toBe('{"a":1}')
  })

  it('extracts bare JSON object from surrounding prose', () => {
    const input = 'Sure! Here you go: {"title":"Trip","days":[]} Have fun!'
    expect(extractJson(input)).toBe('{"title":"Trip","days":[]}')
  })

  it('returns null when no JSON is present', () => {
    expect(extractJson('No json here at all')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractJson('')).toBeNull()
  })

  it('prefers fenced block over bare object when both present', () => {
    const input = 'outer {"ignored":true} ```json\n{"correct":true}\n```'
    expect(extractJson(input)).toBe('{"correct":true}')
  })
})

describe('repairTruncatedJson', () => {
  it('returns valid JSON unchanged', () => {
    const valid = '{"a":1,"b":[1,2,3]}'
    expect(repairTruncatedJson(valid)).toBe(valid)
  })

  it('closes a single unclosed object', () => {
    const truncated = '{"title":"Paris Trip","days":['
    const repaired = repairTruncatedJson(truncated)
    expect(() => JSON.parse(repaired)).not.toThrow()
  })

  it('closes multiple nested unclosed braces', () => {
    const truncated = '{"a":{"b":{"c":1'
    const repaired = repairTruncatedJson(truncated)
    expect(() => JSON.parse(repaired)).not.toThrow()
    const parsed = JSON.parse(repaired)
    expect(parsed.a.b.c).toBe(1)
  })

  it('closes a truncated array', () => {
    const truncated = '{"items":[1,2,3'
    const repaired = repairTruncatedJson(truncated)
    expect(() => JSON.parse(repaired)).not.toThrow()
    expect(JSON.parse(repaired).items).toEqual([1, 2, 3])
  })

  it('handles strings containing brackets without misbalancing', () => {
    const input = '{"key":"value with { bracket inside","other":1}'
    const result = repairTruncatedJson(input)
    expect(result).toBe(input)
    expect(() => JSON.parse(result)).not.toThrow()
  })

  it('strips a trailing dangling key before closing', () => {
    // Simulates Claude stopping mid-key
    const truncated = '{"days":[{"name":"Day 1","desc"'
    const repaired = repairTruncatedJson(truncated)
    expect(() => JSON.parse(repaired)).not.toThrow()
  })
})
