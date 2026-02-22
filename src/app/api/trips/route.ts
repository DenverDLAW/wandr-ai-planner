import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('trips')
    .select('*, itineraries(id, summary, total_cost_estimate_usd, created_at)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trips: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: user.id,
      title: body.title ?? 'Untitled Trip',
      destination: body.destination ?? 'Unknown',
      categories: body.categories ?? [],
      budget_range: body.budgetRange ?? '',
      traveler_count: body.travelers ?? 'couple',
      start_date: body.startDate ?? null,
      end_date: body.endDate ?? null,
      planner_name: body.plannerName ?? '',
      status: 'generated',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trip: data }, { status: 201 })
}
