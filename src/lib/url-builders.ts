export function buildGoogleFlightsUrl(params: {
  destination: string
  departureDate: string
  returnDate?: string
}): string {
  const query = `flights to ${params.destination}`
  const searchParams = new URLSearchParams({ q: query, trip_date: params.departureDate })
  return `https://www.google.com/travel/flights?${searchParams.toString()}`
}

export function buildKayakUrl(params: {
  originIata?: string
  destinationIata?: string
  departureDate: string
  returnDate: string
}): string {
  const origin = params.originIata ?? 'NYC'
  const dest = params.destinationIata ?? 'anywhere'
  return `https://www.kayak.com/flights/${origin}-${dest}/${params.departureDate}/${params.returnDate}`
}

export function buildBookingComUrl(params: {
  destination: string
  checkIn: string
  checkOut: string
  adults: number
}): string {
  const searchParams = new URLSearchParams({
    ss: params.destination,
    checkin: params.checkIn,
    checkout: params.checkOut,
    group_adults: String(params.adults),
  })
  return `https://www.booking.com/searchresults.html?${searchParams.toString()}`
}

export function buildExpediaUrl(params: {
  destination: string
  checkIn: string
  checkOut: string
  adults: number
}): string {
  const searchParams = new URLSearchParams({
    destination: params.destination,
    startDate: params.checkIn,
    endDate: params.checkOut,
    adults: String(params.adults),
  })
  return `https://www.expedia.com/Hotel-Search?${searchParams.toString()}`
}

export function buildViatorUrl(params: { activity: string; city: string }): string {
  return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(`${params.activity} ${params.city}`)}`
}

export function buildGetYourGuideUrl(params: { activity: string; city: string }): string {
  return `https://www.getyourguide.com/s/?q=${encodeURIComponent(`${params.activity} ${params.city}`)}`
}

export function buildGoogleMapsUrl(params: { name: string; city: string }): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(`${params.name} ${params.city}`)}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
