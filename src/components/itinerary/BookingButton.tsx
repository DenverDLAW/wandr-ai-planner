import { ExternalLink } from 'lucide-react'
import type { BookingLink } from '@/types/itinerary'

interface Props {
  links: BookingLink[]
  size?: 'sm' | 'md'
}

const PROVIDER_COLORS: Record<string, string> = {
  'Google Flights': 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
  'Kayak': 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
  'Booking.com': 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200',
  'Expedia': 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
  'Viator': 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
  'GetYourGuide': 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200',
  'Google Maps': 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
}

export function BookingButton({ links, size = 'md' }: Props) {
  if (!links?.length) return null

  const padding = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {links.map((link, i) => {
        const colorClass = PROVIDER_COLORS[link.provider] ?? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
        return (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 font-medium rounded-xl border
                        transition-all duration-150 active:scale-95 ${padding} ${colorClass}`}
          >
            {link.provider}
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        )
      })}
    </div>
  )
}
