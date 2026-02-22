'use client'

import Image from 'next/image'
import { Clock, Utensils } from 'lucide-react'
import type { ItineraryItem } from '@/types/itinerary'
import { formatCurrency } from '@/lib/url-builders'
import { BookingButton } from './BookingButton'
import { usePexelsImage } from '@/hooks/usePexelsImage'

interface Props {
  item: ItineraryItem
}

const TYPE_ICONS = {
  'activity': '🎯',
  'restaurant': '🍽️',
  'transport': '🚗',
  'free-time': '🌅',
}

export function ActivityItem({ item }: Props) {
  const { url: imageUrl, loading } = usePexelsImage(item.imageKeywords)
  const cost = item.estimatedCostPerPersonUsd ?? item.estimatedCostUsd

  return (
    <div className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
      {/* Thumbnail */}
      <div className="relative h-20 w-24 rounded-xl overflow-hidden flex-shrink-0">
        {loading && <div className="absolute inset-0 skeleton" />}
        {!loading && !imageUrl && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-2xl">
            {TYPE_ICONS[item.type]}
          </div>
        )}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="96px"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 leading-tight">{item.name}</h4>
          {item.cuisine && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Utensils className="h-3 w-3" />
              {item.cuisine}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
          {item.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {item.duration}
            </span>
          )}
          {cost != null && cost > 0 && (
            <span className="font-medium text-gray-600">
              {formatCurrency(cost)}/person
            </span>
          )}
          {cost === 0 && (
            <span className="text-emerald-600 font-medium">Free</span>
          )}
        </div>

        <BookingButton links={item.bookingLinks} size="sm" />
      </div>
    </div>
  )
}
