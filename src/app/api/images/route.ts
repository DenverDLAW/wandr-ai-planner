import { NextRequest, NextResponse } from 'next/server'
import { fetchPexelsImage } from '@/lib/images'

const MAX_QUERY_LENGTH = 200

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json({ url: null })
  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 })
  }
  const url = await fetchPexelsImage(q)
  return NextResponse.json({ url })
}
