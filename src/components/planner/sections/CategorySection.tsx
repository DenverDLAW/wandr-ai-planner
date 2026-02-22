'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, ArrowRight, Compass } from 'lucide-react'
import type { TripCategory } from '@/types/planner'
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/types/planner'

interface Props {
  name: string
  onComplete: (categories: TripCategory[]) => void
}

const CATEGORY_PHOTOS: Record<TripCategory, string> = {
  'beach':       'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600',
  'mountains':   'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600',
  'adventure':   'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600',
  'ski':         'https://images.pexels.com/photos/848618/pexels-photo-848618.jpeg?auto=compress&cs=tinysrgb&w=600',
  'city':        'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600',
  'water-sports':'https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg?auto=compress&cs=tinysrgb&w=600',
  'safari':      'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=600',
  'road-trip':   'https://images.pexels.com/photos/1064162/pexels-photo-1064162.jpeg?auto=compress&cs=tinysrgb&w=600',
}

const CATEGORIES: TripCategory[] = [
  'beach', 'mountains', 'adventure', 'ski', 'city', 'water-sports', 'safari', 'road-trip',
]

export function CategorySection({ name, onComplete }: Props) {
  const [selected, setSelected] = useState<TripCategory[]>([])

  const toggle = (cat: TripCategory) => {
    setSelected((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat)
      if (prev.length >= 3) return [...prev.slice(1), cat] // FIFO
      return [...prev, cat]
    })
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-widest uppercase mb-4">
          <Compass className="h-4 w-4" />
          Step 2 of 3
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          What kind of trip, {name}?
        </h2>
        <p className="text-gray-400 text-lg">
          Pick up to 3 — we&apos;ll blend them together.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat)
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className={`relative overflow-hidden rounded-2xl aspect-[4/3] group transition-all duration-200
                ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 scale-[0.98]' : 'hover:scale-[0.98]'}`}
            >
              <Image
                src={CATEGORY_PHOTOS[cat]}
                alt={CATEGORY_LABELS[cat]}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Selected check */}
              {isSelected && (
                <div className="absolute top-3 right-3 h-7 w-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <p className="text-white font-semibold text-sm leading-tight">
                  {CATEGORY_LABELS[cat]}
                </p>
                <p className="text-white/70 text-xs mt-0.5">
                  {CATEGORY_DESCRIPTIONS[cat]}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex justify-center animate-fade-in">
          <button
            onClick={() => onComplete(selected)}
            className="inline-flex items-center gap-3 bg-blue-600 text-white font-semibold
                       text-lg px-8 py-4 rounded-2xl hover:bg-blue-700 active:scale-95
                       transition-all duration-200 shadow-lg shadow-blue-600/25"
          >
            {selected.length === 1
              ? `${CATEGORY_LABELS[selected[0]]} — Next`
              : `${selected.length} vibes selected — Next`}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
