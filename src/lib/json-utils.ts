/**
 * Extract a JSON object/array from a string that may contain fenced code
 * blocks or surrounding prose (e.g. Claude AI responses).
 */
export function extractJson(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (fenced) return fenced[1].trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1)
  return null
}

/**
 * Close any unclosed brackets/braces caused by AI output truncation so that
 * JSON.parse has a chance to succeed on a partial response.
 */
export function repairTruncatedJson(jsonStr: string): string {
  const stack: string[] = []
  let inString = false
  let escape = false

  for (const ch of jsonStr) {
    if (escape) { escape = false; continue }
    if (ch === '\\' && inString) { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{' || ch === '[') stack.push(ch === '{' ? '}' : ']')
    else if ((ch === '}' || ch === ']') && stack.length) stack.pop()
  }

  if (stack.length === 0) return jsonStr

  const trimmed = jsonStr
    .replace(/,?\s*"[^"]*"\s*:\s*$/, '') // strip key with colon but no value: "key":
    .replace(/,?\s*"[^"]*"\s*$/, '')     // strip orphaned key without colon:   "key"
    .replace(/,\s*$/, '')                 // strip trailing comma

  return trimmed + stack.reverse().join('')
}
