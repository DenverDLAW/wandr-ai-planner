import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// next/font self-hosts Inter and injects a preload <link> — no render-blocking external request
const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Wandr — Plan Your Dream Trip in Seconds',
  description: 'Tell us what you want. Our AI builds a complete, bookable itinerary — with imagery, pricing, and links to book everything.',
  openGraph: {
    title: 'Wandr — AI Vacation Planner',
    description: 'Your next adventure, planned in seconds.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
