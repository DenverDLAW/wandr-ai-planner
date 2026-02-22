'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import type { GeneratedItinerary } from '@/types/itinerary'
import { DestinationHero } from './DestinationHero'
import { CostSummaryCard } from './CostSummaryCard'
import { FlightItem } from './FlightItem'
import { HotelItem } from './HotelItem'
import { DayCard } from './DayCard'
import { ShareModal } from './ShareModal'
import { PdfDownloadButton } from './PdfDownloadButton'

interface Props {
  itinerary: GeneratedItinerary
  plannerName: string
  tripId?: string
  onSave?: () => void
}

export function ItineraryDisplay({ itinerary, plannerName, tripId, onSave }: Props) {
  const [showShare, setShowShare] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <DestinationHero itinerary={itinerary} />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-10">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{plannerName}&apos;s Personal Itinerary</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              All prices are estimates — click any booking link to see live rates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PdfDownloadButton itinerary={itinerary} plannerName={plannerName} />
            <button
              onClick={() => setShowShare(true)}
              className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700
                         font-semibold px-5 py-3 rounded-2xl hover:border-blue-400 hover:text-blue-600
                         transition-all duration-200"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* Cost Summary */}
        <section>
          <CostSummaryCard
            totalCost={itinerary.totalCostEstimateUsd}
            breakdown={itinerary.costBreakdown}
            groupSize={itinerary.groupSize}
          />
        </section>

        {/* Flights */}
        {itinerary.flights.length > 0 && (
          <section>
            <SectionHeader emoji="✈️" title="Flights" />
            <div className="space-y-4">
              {itinerary.flights.map((f) => (
                <FlightItem key={f.id} flight={f} />
              ))}
            </div>
          </section>
        )}

        {/* Accommodation */}
        {itinerary.accommodation.length > 0 && (
          <section>
            <SectionHeader emoji="🏨" title="Where You'll Stay" />
            <div className="space-y-4">
              {itinerary.accommodation.map((h) => (
                <HotelItem key={h.id} hotel={h} />
              ))}
            </div>
          </section>
        )}

        {/* Day-by-day */}
        {itinerary.days.length > 0 && (
          <section>
            <SectionHeader emoji="📅" title="Day-by-Day Itinerary" />
            <div className="space-y-6">
              {itinerary.days.map((day) => (
                <DayCard key={day.dayNumber} day={day} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom padding for sticky bar */}
        <div className="h-20" />
      </div>

      {/* Sticky save bar */}
      {onSave && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">Love this trip?</p>
              <p className="text-sm text-gray-400">Save it to your account to access it anytime.</p>
            </div>
            <button
              onClick={onSave}
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-2xl
                         hover:bg-blue-700 active:scale-95 transition-all duration-200
                         shadow-lg shadow-blue-600/30 whitespace-nowrap"
            >
              Save This Trip
            </button>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShare && (
        <ShareModal
          itinerary={itinerary}
          tripId={tripId}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-2xl">{emoji}</span>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
  )
}
