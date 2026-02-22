'use client'

import { DollarSign } from 'lucide-react'
import type { BudgetRange } from '@/types/planner'
import { BUDGET_LABELS, BUDGET_DESCRIPTIONS } from '@/types/planner'

interface Props {
  name: string
  onComplete: (budget: BudgetRange) => void
}

const BUDGETS: BudgetRange[] = ['under-1k', '1k-2k', '2k-5k', '5k-10k', '10k-plus']

const BUDGET_ICONS = ['✈️', '🏨', '🍽️', '🥂', '✨']

export function BudgetSection({ name, onComplete }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto px-8 text-center">
      <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-widest uppercase mb-6">
        <DollarSign className="h-4 w-4" />
        Almost there
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
        What&apos;s your budget?
      </h2>
      <p className="text-gray-400 text-lg mb-10">
        Per person, {name}. We&apos;ll make every dollar count.
      </p>

      <div className="space-y-3">
        {BUDGETS.map((b, i) => (
          <button
            key={b}
            onClick={() => onComplete(b)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl
                       border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50
                       text-left transition-all duration-200 active:scale-[0.99] group"
          >
            <span className="text-2xl w-10 text-center flex-shrink-0">
              {BUDGET_ICONS[i]}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">
                {BUDGET_LABELS[b]}
              </p>
              <p className="text-sm text-gray-400">
                {BUDGET_DESCRIPTIONS[b]} per person
              </p>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-blue-400
                            flex items-center justify-center flex-shrink-0 transition-colors">
              <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-blue-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Tap to select — your itinerary generates immediately
      </p>
    </div>
  )
}
