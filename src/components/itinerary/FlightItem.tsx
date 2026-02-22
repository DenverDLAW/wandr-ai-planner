import Image from 'next/image'
import { format } from 'date-fns'
import { Plane } from 'lucide-react'
import type { FlightOption } from '@/types/itinerary'
import { formatCurrency } from '@/lib/url-builders'
import { BookingButton } from './BookingButton'

interface Props {
  flight: FlightOption
}

export function FlightItem({ flight }: Props) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Photo banner */}
      {flight.imageUrl && (
        <div className="relative h-32 w-full">
          <Image
            src={flight.imageUrl}
            alt={`${flight.from} to ${flight.to}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute left-4 bottom-3 text-white">
            <p className="font-semibold">{flight.type === 'outbound' ? '✈ Outbound' : '✈ Return'}</p>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            {!flight.imageUrl && (
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 text-lg">
                {flight.from} → {flight.to}
              </p>
              <p className="text-gray-400 text-sm">
                {format(new Date(flight.departureDate), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatCurrency(flight.estimatedCostPerPersonUsd)}
            </p>
            <p className="text-xs text-gray-400">per person (est.)</p>
          </div>
        </div>

        {flight.airlines.length > 0 && (
          <p className="text-sm text-gray-500 mt-3">
            Recommended airlines: <span className="font-medium text-gray-700">{flight.airlines.join(', ')}</span>
          </p>
        )}

        <BookingButton links={flight.bookingLinks} />
      </div>
    </div>
  )
}
