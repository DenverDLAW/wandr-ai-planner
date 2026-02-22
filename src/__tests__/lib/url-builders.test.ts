import { describe, it, expect } from 'vitest'
import {
  buildGoogleFlightsUrl,
  buildKayakUrl,
  buildBookingComUrl,
  buildExpediaUrl,
  buildViatorUrl,
  buildGetYourGuideUrl,
  buildGoogleMapsUrl,
  formatCurrency,
} from '@/lib/url-builders'

describe('buildGoogleFlightsUrl', () => {
  it('returns a valid Google Flights URL', () => {
    const url = buildGoogleFlightsUrl({ destination: 'Tokyo', departureDate: '2025-06-01' })
    expect(url).toContain('https://www.google.com/travel/flights')
    expect(url).toContain('Tokyo')
    expect(url).toContain('2025-06-01')
  })
})

describe('buildKayakUrl', () => {
  it('builds URL with provided IATA codes', () => {
    const url = buildKayakUrl({ originIata: 'JFK', destinationIata: 'NRT', departureDate: '2025-06-01', returnDate: '2025-06-14' })
    expect(url).toContain('kayak.com')
    expect(url).toContain('JFK-NRT')
    expect(url).toContain('2025-06-01')
    expect(url).toContain('2025-06-14')
  })

  it('falls back to NYC and anywhere when IATA codes are omitted', () => {
    const url = buildKayakUrl({ departureDate: '2025-06-01', returnDate: '2025-06-14' })
    expect(url).toContain('NYC-anywhere')
  })
})

describe('buildBookingComUrl', () => {
  it('includes destination, checkin, checkout, and adults', () => {
    const url = buildBookingComUrl({ destination: 'Bali', checkIn: '2025-06-01', checkOut: '2025-06-10', adults: 2 })
    expect(url).toContain('booking.com')
    expect(url).toContain('Bali')
    expect(url).toContain('2025-06-01')
    expect(url).toContain('2025-06-10')
    expect(url).toContain('group_adults=2')
  })
})

describe('buildExpediaUrl', () => {
  it('includes destination and dates', () => {
    const url = buildExpediaUrl({ destination: 'Rome', checkIn: '2025-07-01', checkOut: '2025-07-08', adults: 1 })
    expect(url).toContain('expedia.com')
    expect(url).toContain('Rome')
    expect(url).toContain('adults=1')
  })
})

describe('buildViatorUrl', () => {
  it('encodes activity and city into the URL', () => {
    const url = buildViatorUrl({ activity: 'Colosseum Tour', city: 'Rome' })
    expect(url).toContain('viator.com')
    expect(url).toContain(encodeURIComponent('Colosseum Tour Rome'))
  })
})

describe('buildGetYourGuideUrl', () => {
  it('encodes activity and city into the URL', () => {
    const url = buildGetYourGuideUrl({ activity: 'Snorkeling', city: 'Cancun' })
    expect(url).toContain('getyourguide.com')
    expect(url).toContain(encodeURIComponent('Snorkeling Cancun'))
  })
})

describe('buildGoogleMapsUrl', () => {
  it('encodes name and city', () => {
    const url = buildGoogleMapsUrl({ name: 'Eiffel Tower', city: 'Paris' })
    expect(url).toContain('google.com/maps/search')
    expect(url).toContain(encodeURIComponent('Eiffel Tower Paris'))
  })
})

describe('formatCurrency', () => {
  it('formats a whole number with $ and commas', () => {
    expect(formatCurrency(1500)).toBe('$1,500')
  })

  it('formats zero as $0', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('rounds decimals (no cents shown)', () => {
    expect(formatCurrency(1234.99)).toBe('$1,235')
  })

  it('formats large amounts with commas', () => {
    expect(formatCurrency(10000)).toBe('$10,000')
  })
})
