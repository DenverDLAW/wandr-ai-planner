import type { GeneratedItinerary } from './itinerary'

export interface Trip {
  id: string
  user_id: string | null
  title: string
  destination: string
  categories: string[]
  budget_range: string
  traveler_count: string
  start_date: string | null
  end_date: string | null
  planner_name: string
  status: 'generated' | 'saved'
  created_at: string
  updated_at: string
  itineraries?: Itinerary[]
}

export interface Itinerary {
  id: string
  trip_id: string
  user_id: string | null
  raw_json: GeneratedItinerary
  summary: string | null
  total_cost_estimate_usd: number | null
  created_at: string
}
