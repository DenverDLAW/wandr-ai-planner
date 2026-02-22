'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import type { ItineraryDay } from '@/types/itinerary'
import { ActivityItem } from './ActivityItem'
import { usePexelsImage } from '@/hooks/usePexelsImage'

interface Props {
  day: ItineraryDay
}

export function DayCard({ day }: Props) {
  const { url: imageUrl, loading } = usePexelsImage(day.imageKeywords)
  const hasItems = (period: { items: unknown[] }) => period.items.length > 0

  return (
    <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      {/* Day hero photo */}
      <div className="relative h-40 sm:h-48 w-full overflow-hidden">
        <div
          className={`absolute inset-0 ${
            loading ? 'skeleton' : 'bg-gradient-to-br from-blue-600 to-indigo-700'
          } ${imageUrl ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
        />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={day.theme}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
                Day {day.dayNumber}
              </p>
              <h3 className="text-lg sm:text-xl font-bold leading-tight">{day.theme}</h3>
            </div>
            <p className="text-white/70 text-sm">
              {format(new Date(day.date), 'EEE, MMM d')}
            </p>
          </div>
        </div>
      </div>

      {/* Periods */}
      <div className="divide-y divide-gray-50">
        {hasItems(day.morning) && (
          <PeriodSection label="Morning" emoji="🌅" period={day.morning} />
        )}
        {hasItems(day.afternoon) && (
          <PeriodSection label="Afternoon" emoji="☀️" period={day.afternoon} />
        )}
        {hasItems(day.evening) && (
          <PeriodSection label="Evening" emoji="🌙" period={day.evening} />
        )}
      </div>
    </div>
  )
}

function PeriodSection({
  label,
  emoji,
  period,
}: {
  label: string
  emoji: string
  period: ItineraryDay['morning']
}) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span>{emoji}</span>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</h4>
      </div>
      {period.description && (
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">{period.description}</p>
      )}
      <div>
        {period.items.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
