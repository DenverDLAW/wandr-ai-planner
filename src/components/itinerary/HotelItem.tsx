'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import { MapPin, Calendar, Star } from 'lucide-react'
import type { AccommodationOption } from '@/types/itinerary'
import { formatCurrency } from '@/lib/url-builders'
import { BookingButton } from './BookingButton'
import { usePexelsImage } from '@/hooks/usePexelsImage'

interface Props {
  hotel: AccommodationOption
}

export function HotelItem({ hotel }: Props) {
  const { url: imageUrl, loading } = usePexelsImage(hotel.imageKeywords)

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row">
      {/* Photo */}
      <div className="relative h-44 sm:h-56 md:h-auto md:w-[45%] flex-shrink-0">
        {loading && <div className="absolute inset-0 skeleton" />}
        {!loading && !imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <span className="text-6xl">🏨</span>
          </div>
        )}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={hotel.name}
            fill
            className="object-cover transition-opacity duration-700"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{hotel.name}</h3>
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {hotel.location}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mt-3">
            {hotel.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span>
                {format(new Date(hotel.checkIn), 'MMM d')} –{' '}
                {format(new Date(hotel.checkOut), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-end gap-3 mb-3">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatCurrency(hotel.estimatedCostPerNightUsd)}
              </p>
              <p className="text-xs text-gray-400">per night (est.)</p>
            </div>
            <div className="text-sm text-gray-500 pb-1">
              · <span className="font-medium">{formatCurrency(hotel.totalCostUsd)}</span> total
            </div>
          </div>
          <BookingButton links={hotel.bookingLinks} />
        </div>
      </div>
    </div>
  )
}
