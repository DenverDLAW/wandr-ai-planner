'use client'

import type { CostBreakdown } from '@/types/itinerary'
import { formatCurrency } from '@/lib/url-builders'

interface Props {
  totalCost: number
  breakdown: CostBreakdown
  groupSize: number
}

const CATEGORIES = [
  { key: 'flights' as const, label: 'Flights', emoji: '✈️', color: 'bg-blue-500' },
  { key: 'accommodation' as const, label: 'Accommodation', emoji: '🏨', color: 'bg-indigo-500' },
  { key: 'activities' as const, label: 'Activities', emoji: '🎯', color: 'bg-emerald-500' },
  { key: 'food' as const, label: 'Food & Dining', emoji: '🍽️', color: 'bg-amber-500' },
  { key: 'transport' as const, label: 'Local Transport', emoji: '🚗', color: 'bg-rose-400' },
]

export function CostSummaryCard({ totalCost, breakdown, groupSize }: Props) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0) || totalCost

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estimated Cost</h2>
          <p className="text-gray-400 mt-1">Per person · {groupSize} traveler{groupSize > 1 ? 's' : ''}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-gray-900">
            {formatCurrency(total)}
          </p>
          <p className="text-gray-400 text-sm mt-1">per person</p>
          {groupSize > 1 && (
            <p className="text-blue-600 font-semibold mt-1">
              {formatCurrency(total * groupSize)} total
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map(({ key, label, emoji, color }) => {
          const amount = breakdown[key] ?? 0
          const pct = total > 0 ? Math.round((amount / total) * 100) : 0
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span>{emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{pct}%</span>
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
        <span className="text-gray-500 text-sm">
          All prices are estimates in USD
        </span>
        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
          Based on current market rates
        </span>
      </div>
    </div>
  )
}
