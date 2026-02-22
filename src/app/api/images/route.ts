import { NextRequest, NextResponse } from 'next/server'
import { fetchPexelsImage } from '@/lib/images'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json({ url: null })
  const url = await fetchPexelsImage(q)
  return NextResponse.json({ url })
}
