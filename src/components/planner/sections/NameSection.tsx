'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

interface Props {
  onComplete: (name: string) => void
}

export function NameSection({ onComplete }: Props) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus when section becomes visible
    const timer = setTimeout(() => inputRef.current?.focus(), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = () => {
    if (name.trim().length >= 1) onComplete(name.trim())
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-8 text-center">
      <p className="text-sm font-medium text-blue-600 tracking-widest uppercase mb-6">
        Welcome
      </p>
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
        What&apos;s your name?
      </h1>
      <p className="text-xl text-gray-400 mb-12">
        We&apos;d love to make this personal.
      </p>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Your first name"
          className="w-full text-3xl md:text-4xl font-light text-gray-900 placeholder-gray-300
                     border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none
                     pb-4 bg-transparent transition-colors text-center"
          autoComplete="given-name"
        />
      </div>

      {name.trim().length >= 1 && (
        <button
          onClick={handleSubmit}
          className="mt-10 inline-flex items-center gap-3 bg-blue-600 text-white font-semibold
                     text-lg px-8 py-4 rounded-2xl hover:bg-blue-700 active:scale-95
                     transition-all duration-200 shadow-lg shadow-blue-600/25 animate-fade-in"
        >
          Continue
          <ArrowRight className="h-5 w-5" />
        </button>
      )}

      <p className="mt-6 text-sm text-gray-400">
        Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Enter</kbd> to continue
      </p>
    </div>
  )
}
