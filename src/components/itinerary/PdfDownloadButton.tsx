'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import type { GeneratedItinerary } from '@/types/itinerary'

interface Props {
  itinerary: GeneratedItinerary
  plannerName: string
}

export function PdfDownloadButton({ itinerary, plannerName }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownload = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary, plannerName }),
      })

      if (!res.ok) throw new Error('PDF generation failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${itinerary.destinationCity.replace(/\s+/g, '-')}-itinerary.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setError('Could not generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-2.5 bg-gray-900 text-white font-semibold
                   px-6 py-3 rounded-2xl hover:bg-gray-800 active:scale-95 transition-all
                   duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating PDF…
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Download PDF
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
