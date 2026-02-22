'use client'

import { Users } from 'lucide-react'
import type { TravelerCount } from '@/types/planner'
import { TRAVELER_LABELS, TRAVELER_DESCRIPTIONS } from '@/types/planner'

interface Props {
  name: string
  onComplete: (travelers: TravelerCount) => void
}

const TRAVELERS: TravelerCount[] = ['solo', 'couple', 'small-group', 'large-group']

const TRAVELER_EMOJIS: Record<TravelerCount, string> = {
  'solo': '🧍',
  'couple': '👫',
  'small-group': '👨‍👩‍👧‍👦',
  'large-group': '🎉',
}

export function TravelersSection({ name, onComplete }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto px-8 text-center">
      <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-widest uppercase mb-6">
        <Users className="h-4 w-4" />
        Step 3 of 3
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
        Who&apos;s coming along?
      </h2>
      <p className="text-gray-400 text-lg mb-10">
        This helps us tailor the experience for your group, {name}.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {TRAVELERS.map((t) => (
          <button
            key={t}
            onClick={() => onComplete(t)}
            className="group flex flex-col items-center gap-3 p-6 rounded-3xl
                       border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50
                       transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span className="text-4xl">{TRAVELER_EMOJIS[t]}</span>
            <div>
              <p className="font-semibold text-gray-900 text-lg">
                {TRAVELER_LABELS[t]}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                {TRAVELER_DESCRIPTIONS[t]}
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Tap to select and continue automatically
      </p>
    </div>
  )
}
