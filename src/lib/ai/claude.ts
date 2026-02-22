import type { TripInputs } from '@/types/planner'
import { CATEGORY_LABELS, BUDGET_DESCRIPTIONS, TRAVELER_SIZES } from '@/types/planner'

export function buildItineraryPrompt(inputs: TripInputs): string {
  const { plannerName, startDate, endDate, categories, budgetRange, travelers } = inputs

  const categoryNames = categories.map((c) => CATEGORY_LABELS[c]).join(', ')
  const budgetText = BUDGET_DESCRIPTIONS[budgetRange]
  const groupSize = TRAVELER_SIZES[travelers]

  const start = new Date(startDate)
  const end = new Date(endDate)
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const days = nights + 1

  return `You are a luxury travel planner. Create a complete itinerary for ${plannerName}.

TRIP: ${categoryNames} | ${budgetText} per person | ${groupSize} traveler(s) | ${startDate} to ${endDate} (${nights} nights, ${days} days)

RULES:
- Choose the single best destination for this trip type and budget
- Use REAL hotel/restaurant/attraction names
- Keep ALL descriptions under 20 words — be concise
- Max 1 item per morning/afternoon/evening period
- Only 1 booking link per item
- Return ONLY the JSON block below, no other text

IMAGE KEYWORDS — this is critical for photo quality:
- Hotels: ALWAYS start with exact property name + city + one visual detail. e.g. "Four Seasons Bali Sayan infinity pool", "Aman Tokyo lobby interior"
- Restaurants: exact name + city + dish or interior. e.g. "Nobu Malibu ocean terrace", "Locavore Ubud plated dish"
- Activities: specific attraction name + location + action. e.g. "Blue Cave Dalmatia kayak", "Machu Picchu sunrise mist ruins"
- Day headers: main landmark or landscape of that day's theme. e.g. "Ubud rice terraces Tegallalang sunrise"
- Destination hero: most iconic, visually stunning landmark of the destination

\`\`\`json
{
  "title": "string",
  "summary": "2 sentence trip summary personalized to ${plannerName}",
  "destination": "City, Country",
  "destinationCity": "City",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "groupSize": ${groupSize},
  "travelStyle": "${categoryNames}",
  "totalCostEstimateUsd": 0,
  "costBreakdown": { "flights": 0, "accommodation": 0, "activities": 0, "food": 0, "transport": 0 },
  "imageKeywords": "destination hero photo keywords",
  "flights": [
    {
      "id": "flight-1",
      "type": "outbound",
      "from": "Nearest major US hub",
      "to": "Destination airport",
      "departureDate": "${startDate}",
      "estimatedCostPerPersonUsd": 0,
      "airlines": ["Airline 1"],
      "imageKeywords": "airplane sunset clouds",
      "bookingLinks": [
        { "provider": "Google Flights", "url": "https://www.google.com/travel/flights?q=flights+to+DESTINATION&trip_date=${startDate}" },
        { "provider": "Kayak", "url": "https://www.kayak.com/flights/NYC-IATA/${startDate}/${endDate}" }
      ]
    },
    {
      "id": "flight-2",
      "type": "return",
      "from": "Destination airport",
      "to": "Nearest major US hub",
      "departureDate": "${endDate}",
      "estimatedCostPerPersonUsd": 0,
      "airlines": ["Airline 1"],
      "imageKeywords": "airport terminal departure",
      "bookingLinks": [
        { "provider": "Google Flights", "url": "https://www.google.com/travel/flights?q=flights+to+USA&trip_date=${endDate}" }
      ]
    }
  ],
  "accommodation": [
    {
      "id": "hotel-1",
      "name": "Hotel Name",
      "type": "hotel",
      "checkIn": "${startDate}",
      "checkOut": "${endDate}",
      "location": "Neighborhood, City",
      "estimatedCostPerNightUsd": 0,
      "totalCostUsd": 0,
      "description": "Brief description under 30 words.",
      "imageKeywords": "Four Seasons Bali Sayan pool villa jungle",
      "bookingLinks": [
        { "provider": "Booking.com", "url": "https://www.booking.com/searchresults.html?ss=HOTEL+NAME&checkin=${startDate}&checkout=${endDate}&group_adults=${groupSize}" },
        { "provider": "Expedia", "url": "https://www.expedia.com/Hotel-Search?destination=HOTEL+NAME&startDate=${startDate}&endDate=${endDate}" }
      ]
    }
  ],
  "days": [
    {
      "dayNumber": 1,
      "date": "${startDate}",
      "theme": "Day Theme",
      "imageKeywords": "Ubud rice terraces Tegallalang sunrise aerial",
      "morning": {
        "description": "Brief morning summary",
        "items": [
          {
            "id": "item-1-1",
            "type": "activity",
            "name": "Activity Name",
            "description": "Brief description.",
            "estimatedCostUsd": 0,
            "imageKeywords": "Tegallalang Rice Terrace Ubud Bali trekking",
            "bookingLinks": [
              { "provider": "Viator", "url": "https://www.viator.com/searchResults/all?text=ACTIVITY+NAME" }
            ]
          }
        ]
      },
      "afternoon": { "description": "Brief afternoon summary", "items": [] },
      "evening": {
        "description": "Evening summary",
        "items": [
          {
            "id": "item-1-2",
            "type": "restaurant",
            "name": "Restaurant Name",
            "description": "Brief description.",
            "estimatedCostPerPersonUsd": 0,
            "cuisine": "Cuisine type",
            "imageKeywords": "Locavore restaurant Ubud plated dish elegant",
            "bookingLinks": [
              { "provider": "Google Maps", "url": "https://www.google.com/maps/search/RESTAURANT+NAME" }
            ]
          }
        ]
      }
    }
  ]
}
\`\`\`

Now generate the FULL itinerary for all ${days} days. Replace all placeholder values. Every field is required. Keep descriptions concise.`
}
