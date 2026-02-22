'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import { MapPin, Calendar, Users } from 'lucide-react'
import type { GeneratedItinerary } from '@/types/itinerary'
import { formatCurrency } from '@/lib/url-builders'
import { usePexelsImage } from '@/hooks/usePexelsImage'

interface Props {
  itinerary: GeneratedItinerary
}

export function DestinationHero({ itinerary }: Props) {
  const { url: imageUrl, loading } = usePexelsImage(itinerary.imageKeywords)

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {/* Base layer: shimmer while fetching, deep-blue fallback once resolved */}
      <div
        className={`absolute inset-0 ${
          loading ? 'skeleton' : 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900'
        } ${imageUrl ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
      />
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={itinerary.destination}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
        <div className="max-w-4xl">
          <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase mb-3">
            Your personalized itinerary
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            {itinerary.title}
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-6 max-w-2xl leading-relaxed">
            {itinerary.summary}
          </p>

          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              {itinerary.destination}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              {format(new Date(itinerary.startDate), 'MMM d')} –{' '}
              {format(new Date(itinerary.endDate), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              {itinerary.groupSize} traveler{itinerary.groupSize > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1">
              Est. {formatCurrency(itinerary.totalCostEstimateUsd)} per person
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
