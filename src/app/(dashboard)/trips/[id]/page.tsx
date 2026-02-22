import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ItineraryDisplay } from '@/components/itinerary/ItineraryDisplay'

interface Props {
  params: { id: string }
}

export default async function TripDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.id) redirect('/login')

  const { data: trip, error } = await supabase
    .from('trips')
    .select('*, itineraries(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !trip) return notFound()

  const itinerary = trip.itineraries?.[0]?.raw_json
  if (!itinerary) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Itinerary not found for this trip.</p>
      </div>
    )
  }

  return (
    <ItineraryDisplay
      itinerary={itinerary}
      plannerName={trip.planner_name ?? 'Traveler'}
      tripId={trip.id}
    />
  )
}
