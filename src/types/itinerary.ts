export interface BookingLink {
  provider: string
  url: string
}

export interface FlightOption {
  id: string
  type: 'outbound' | 'return'
  from: string
  to: string
  departureDate: string
  estimatedCostPerPersonUsd: number
  airlines: string[]
  bookingLinks: BookingLink[]
  imageKeywords: string
  imageUrl?: string
}

export interface AccommodationOption {
  id: string
  name: string
  type: string
  checkIn: string
  checkOut: string
  location: string
  estimatedCostPerNightUsd: number
  totalCostUsd: number
  description: string
  bookingLinks: BookingLink[]
  imageKeywords: string
  imageUrl?: string
}

export type ItineraryItemType = 'activity' | 'restaurant' | 'transport' | 'free-time'

export interface ItineraryItem {
  id: string
  type: ItineraryItemType
  name: string
  description: string
  estimatedCostUsd?: number
  estimatedCostPerPersonUsd?: number
  duration?: string
  cuisine?: string
  bookingLinks: BookingLink[]
  imageKeywords: string
  imageUrl?: string
}

export interface DayPeriod {
  description: string
  items: ItineraryItem[]
}

export interface ItineraryDay {
  dayNumber: number
  date: string
  theme: string
  morning: DayPeriod
  afternoon: DayPeriod
  evening: DayPeriod
  imageKeywords: string
  imageUrl?: string
}

export interface CostBreakdown {
  flights: number
  accommodation: number
  activities: number
  food: number
  transport: number
}

export interface GeneratedItinerary {
  title: string
  summary: string
  destination: string
  destinationCity: string
  startDate: string
  endDate: string
  groupSize: number
  travelStyle: string
  totalCostEstimateUsd: number
  costBreakdown: CostBreakdown
  flights: FlightOption[]
  accommodation: AccommodationOption[]
  days: ItineraryDay[]
  imageKeywords: string
  imageUrl?: string
}
