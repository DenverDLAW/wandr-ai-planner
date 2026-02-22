import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { MapPin, Calendar, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/url-builders'
import type { Trip } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: trips } = await supabase
    .from('trips')
    .select('*, itineraries(id, summary, total_cost_estimate_usd, raw_json)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-400 mt-1">
            {trips?.length ?? 0} saved trip{trips?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/plan"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold
                     px-5 py-3 rounded-2xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Plan New Trip
        </Link>
      </div>

      {!trips?.length ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip: Trip & { itineraries: Array<{ id: string; summary: string | null; total_cost_estimate_usd: number | null; raw_json: { imageUrl?: string } }> }) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}

function TripCard({ trip }: { trip: Trip & { itineraries: Array<{ id: string; summary: string | null; total_cost_estimate_usd: number | null; raw_json: { imageUrl?: string } }> } }) {
  const itinerary = trip.itineraries?.[0]
  const imageUrl = itinerary?.raw_json?.imageUrl

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300"
    >
      {/* Photo */}
      <div className="relative h-48 w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={trip.destination}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white font-bold text-lg leading-tight">{trip.title}</p>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            {trip.destination}
          </span>
          {trip.start_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              {format(new Date(trip.start_date), 'MMM d, yyyy')}
            </span>
          )}
        </div>

        {itinerary?.summary && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {itinerary.summary}
          </p>
        )}

        {itinerary?.total_cost_estimate_usd && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-blue-600 font-bold text-lg">
              {formatCurrency(itinerary.total_cost_estimate_usd)}
            </span>
            <span className="text-xs text-gray-400">per person (est.)</span>
          </div>
        )}
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">🗺️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">No trips yet</h2>
      <p className="text-gray-400 mb-8 max-w-sm mx-auto">
        Plan your first trip in under a minute — just tell us what you&apos;re looking for.
      </p>
      <Link
        href="/plan"
        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold
                   px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
      >
        <Plus className="h-5 w-5" />
        Plan Your First Trip
      </Link>
    </div>
  )
}
