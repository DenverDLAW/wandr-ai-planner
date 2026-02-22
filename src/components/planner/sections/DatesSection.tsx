'use client'

import { useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { format, differenceInDays } from 'date-fns'
import { ArrowRight, Calendar } from 'lucide-react'

interface Props {
  name: string
  onComplete: (startDate: string, endDate: string) => void
}

export function DatesSection({ name, onComplete }: Props) {
  const [range, setRange] = useState<DateRange | undefined>()

  const nights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : null

  const handleContinue = () => {
    if (range?.from && range?.to) {
      onComplete(
        format(range.from, 'yyyy-MM-dd'),
        format(range.to, 'yyyy-MM-dd')
      )
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-8 text-center">
      <div className="mb-2">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-widest uppercase">
          <Calendar className="h-4 w-4" />
          Step 1 of 3
        </span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
        Hi {name}! 👋
      </h2>
      <p className="text-2xl text-gray-500 mb-2">
        Can&apos;t wait to plan your vacation with you.
      </p>
      <p className="text-xl text-gray-400 mb-8">
        First — when are you going?
      </p>

      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 p-6 border border-gray-100">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: new Date() }}
            numberOfMonths={2}
          />
        </div>
      </div>

      {range?.from && range?.to && (
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 rounded-2xl px-6 py-3 mb-6 text-sm font-medium">
            <span>{format(range.from, 'MMM d, yyyy')}</span>
            <span>→</span>
            <span>{format(range.to, 'MMM d, yyyy')}</span>
            <span className="text-blue-400">·</span>
            <span>{nights} night{nights !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-3 bg-blue-600 text-white font-semibold
                         text-lg px-8 py-4 rounded-2xl hover:bg-blue-700 active:scale-95
                         transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
