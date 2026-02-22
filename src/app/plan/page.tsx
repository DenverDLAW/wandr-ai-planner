'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { NameSection } from '@/components/planner/sections/NameSection'
import { DatesSection } from '@/components/planner/sections/DatesSection'
import { CategorySection } from '@/components/planner/sections/CategorySection'
import { TravelersSection } from '@/components/planner/sections/TravelersSection'
import { BudgetSection } from '@/components/planner/sections/BudgetSection'
import { GeneratingScreen } from '@/components/planner/GeneratingScreen'
import { ProgressIndicator } from '@/components/planner/ProgressIndicator'
import { ItineraryDisplay } from '@/components/itinerary/ItineraryDisplay'
import type { TripInputs, TripCategory, TravelerCount, BudgetRange } from '@/types/planner'
import type { GeneratedItinerary } from '@/types/itinerary'
import Link from 'next/link'

type Step = 0 | 1 | 2 | 3 | 4

const TOTAL_STEPS = 5

export default function PlanPage() {
  const [step, setStep] = useState<Step>(0)
  const [generating, setGenerating] = useState(false)
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null)
  const [error, setError] = useState('')
  const [inputs, setInputs] = useState<Partial<TripInputs>>({})

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Load name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('wandr_name')
    if (savedName) setInputs((prev) => ({ ...prev, plannerName: savedName }))
  }, [])

  const scrollToStep = useCallback((s: Step) => {
    sectionRefs.current[s]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleName = (name: string) => {
    localStorage.setItem('wandr_name', name)
    setInputs((prev) => ({ ...prev, plannerName: name }))
    setStep(1)
    setTimeout(() => scrollToStep(1), 100)
  }

  const handleDates = (startDate: string, endDate: string) => {
    setInputs((prev) => ({ ...prev, startDate, endDate }))
    setStep(2)
    setTimeout(() => scrollToStep(2), 100)
  }

  const handleCategories = (categories: TripCategory[]) => {
    setInputs((prev) => ({ ...prev, categories }))
    setStep(3)
    setTimeout(() => scrollToStep(3), 100)
  }

  const handleTravelers = (travelers: TravelerCount) => {
    setInputs((prev) => ({ ...prev, travelers }))
    setStep(4)
    setTimeout(() => scrollToStep(4), 100)
  }

  const handleBudget = async (budgetRange: BudgetRange) => {
    const finalInputs = { ...inputs, budgetRange } as TripInputs
    setInputs(finalInputs)
    setGenerating(true)

    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: finalInputs }),
      })

      if (!res.ok || !res.body) {
        // Non-streaming error (e.g. 400 validation)
        const text = await res.text()
        try {
          const json = JSON.parse(text)
          throw new Error(json.error ?? 'Generation failed')
        } catch {
          throw new Error('Generation failed')
        }
      }

      // Consume SSE stream
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        // Process any bytes even on final read (done=true can carry the last chunk)
        if (value) {
          buffer += decoder.decode(value, { stream: !done })

          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const event = JSON.parse(line.slice(6))
              if (event.type === 'done') {
                setItinerary(event.itinerary)
                return
              } else if (event.type === 'error') {
                throw new Error(event.error ?? 'Generation failed')
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue
              throw e
            }
          }
        }
        if (done) break
      }
      // Stream closed without a 'done' event — likely a server timeout
      throw new Error('Generation timed out — please try again')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  // Show itinerary result
  if (itinerary) {
    return (
      <ItineraryDisplay
        itinerary={itinerary}
        plannerName={inputs.plannerName ?? 'Traveler'}
        onSave={() => {
          // Redirect to login with a message to save
          window.location.href = '/login?next=/dashboard'
        }}
      />
    )
  }

  return (
    <div className="relative">
      {/* Generating overlay */}
      {generating && <GeneratingScreen name={inputs.plannerName ?? 'Traveler'} />}

      {/* Error state */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl">
            <p className="text-4xl mb-4">😕</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => { setError(''); setGenerating(false) }}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
          Wandr
        </Link>
      </nav>

      {/* Progress indicator */}
      <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

      {/* Scroll-snap container */}
      <div className="planner-container">
        {/* Section 0: Name */}
        <div
          className="planner-section"
          ref={(el) => { sectionRefs.current[0] = el }}
        >
          <SectionWrapper isVisible={true}>
            <NameSection onComplete={handleName} />
          </SectionWrapper>
        </div>

        {/* Section 1: Dates */}
        <div
          className="planner-section bg-gray-50"
          ref={(el) => { sectionRefs.current[1] = el }}
        >
          <SectionWrapper isVisible={step >= 1}>
            <DatesSection
              name={inputs.plannerName ?? ''}
              onComplete={handleDates}
            />
          </SectionWrapper>
        </div>

        {/* Section 2: Categories */}
        <div
          className="planner-section"
          ref={(el) => { sectionRefs.current[2] = el }}
        >
          <SectionWrapper isVisible={step >= 2}>
            <CategorySection
              name={inputs.plannerName ?? ''}
              onComplete={handleCategories}
            />
          </SectionWrapper>
        </div>

        {/* Section 3: Travelers */}
        <div
          className="planner-section bg-gray-50"
          ref={(el) => { sectionRefs.current[3] = el }}
        >
          <SectionWrapper isVisible={step >= 3}>
            <TravelersSection
              name={inputs.plannerName ?? ''}
              onComplete={handleTravelers}
            />
          </SectionWrapper>
        </div>

        {/* Section 4: Budget */}
        <div
          className="planner-section"
          ref={(el) => { sectionRefs.current[4] = el }}
        >
          <SectionWrapper isVisible={step >= 4}>
            <BudgetSection
              name={inputs.plannerName ?? ''}
              onComplete={handleBudget}
            />
          </SectionWrapper>
        </div>
      </div>
    </div>
  )
}

function SectionWrapper({
  children,
  isVisible,
}: {
  children: React.ReactNode
  isVisible: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible])

  return (
    <div
      ref={ref}
      className={`section-content w-full ${visible ? 'visible' : ''}`}
    >
      {children}
    </div>
  )
}
