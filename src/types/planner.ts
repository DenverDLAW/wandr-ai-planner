export type TripCategory =
  | 'beach'
  | 'mountains'
  | 'adventure'
  | 'ski'
  | 'city'
  | 'water-sports'
  | 'safari'
  | 'road-trip'

export type BudgetRange =
  | 'under-1k'
  | '1k-2k'
  | '2k-5k'
  | '5k-10k'
  | '10k-plus'

export type TravelerCount = 'solo' | 'couple' | 'small-group' | 'large-group'

export interface TripInputs {
  plannerName: string
  startDate: string   // YYYY-MM-DD
  endDate: string     // YYYY-MM-DD
  categories: TripCategory[]
  budgetRange: BudgetRange
  travelers: TravelerCount
}

export const CATEGORY_LABELS: Record<TripCategory, string> = {
  'beach': 'Beach & Relaxation',
  'mountains': 'Mountains & Hiking',
  'adventure': 'Adventure & Outdoors',
  'ski': 'Ski & Snow',
  'city': 'City & Culture',
  'water-sports': 'Water Sports',
  'safari': 'Safari & Wildlife',
  'road-trip': 'Road Trip',
}

export const CATEGORY_DESCRIPTIONS: Record<TripCategory, string> = {
  'beach': 'Sun, sand, and total unwinding',
  'mountains': 'Trails, peaks, and fresh air',
  'adventure': 'Adrenaline, exploration, the wild',
  'ski': 'Slopes, lodges, and après-ski',
  'city': 'Museums, food, nightlife, history',
  'water-sports': 'Surfing, diving, sailing, kayaking',
  'safari': 'Big five, national parks, bush camps',
  'road-trip': 'Scenic drives, freedom, no fixed plan',
}

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  'under-1k': 'Budget',
  '1k-2k': 'Moderate',
  '2k-5k': 'Comfortable',
  '5k-10k': 'Premium',
  '10k-plus': 'Luxury',
}

export const BUDGET_DESCRIPTIONS: Record<BudgetRange, string> = {
  'under-1k': 'Under $1,000',
  '1k-2k': '$1,000 – $2,000',
  '2k-5k': '$2,000 – $5,000',
  '5k-10k': '$5,000 – $10,000',
  '10k-plus': '$10,000+',
}

export const TRAVELER_LABELS: Record<TravelerCount, string> = {
  'solo': 'Solo',
  'couple': 'Couple',
  'small-group': 'Small Group',
  'large-group': 'Large Group',
}

export const TRAVELER_DESCRIPTIONS: Record<TravelerCount, string> = {
  'solo': 'Just me',
  'couple': '2 travelers',
  'small-group': '3–5 travelers',
  'large-group': '6+ travelers',
}

export const TRAVELER_SIZES: Record<TravelerCount, number> = {
  'solo': 1,
  'couple': 2,
  'small-group': 4,
  'large-group': 8,
}
