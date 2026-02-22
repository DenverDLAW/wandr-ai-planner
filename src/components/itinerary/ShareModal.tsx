'use client'

import { useState } from 'react'
import { X, Mail, Link, Check } from 'lucide-react'
import type { GeneratedItinerary } from '@/types/itinerary'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/url-builders'

interface Props {
  itinerary: GeneratedItinerary
  tripId?: string
  onClose: () => void
}

export function ShareModal({ itinerary, tripId, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const shareUrl = tripId ? `${appUrl}/trips/${tripId}` : appUrl

  const emailSubject = encodeURIComponent(
    `Check out this trip to ${itinerary.destination}!`
  )
  const emailBody = encodeURIComponent(
    `Hey!\n\nI'm planning a trip to ${itinerary.destination} ` +
    `(${format(new Date(itinerary.startDate), 'MMM d')} – ${format(new Date(itinerary.endDate), 'MMM d, yyyy')}).\n\n` +
    `I used an AI trip planner and it generated this amazing itinerary:\n` +
    `${itinerary.title}\n\n` +
    `Estimated cost: ${formatCurrency(itinerary.totalCostEstimateUsd)} per person\n\n` +
    `View the full itinerary here: ${shareUrl}\n\n` +
    `Would love for you to join!`
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Share your trip</h2>
        <p className="text-gray-400 mb-8">
          Let a friend see your {itinerary.destination} itinerary before you book.
        </p>

        {/* Email option */}
        <a
          href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 mb-3 group"
        >
          <div className="h-11 w-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Send via email</p>
            <p className="text-sm text-gray-400">Opens your email app with a pre-filled message</p>
          </div>
        </a>

        {/* Copy link option */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="h-11 w-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
            {copied ? (
              <Check className="h-5 w-5 text-emerald-600" />
            ) : (
              <Link className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
            )}
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">
              {copied ? 'Link copied!' : 'Copy link'}
            </p>
            <p className="text-sm text-gray-400 truncate max-w-[220px]">{shareUrl}</p>
          </div>
        </button>
      </div>
    </div>
  )
}
