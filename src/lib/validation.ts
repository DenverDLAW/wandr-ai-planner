import { z } from 'zod'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const TripInputsSchema = z
  .object({
    plannerName: z.string().min(1, 'Name is required').max(100),
    startDate: z
      .string()
      .regex(DATE_REGEX, 'startDate must be YYYY-MM-DD'),
    endDate: z
      .string()
      .regex(DATE_REGEX, 'endDate must be YYYY-MM-DD'),
    categories: z
      .array(
        z.enum(['beach', 'mountains', 'adventure', 'ski', 'city', 'water-sports', 'safari', 'road-trip'])
      )
      .min(1, 'At least one category is required'),
    budgetRange: z.enum(['under-1k', '1k-2k', '2k-5k', '5k-10k', '10k-plus']),
    travelers: z.enum(['solo', 'couple', 'small-group', 'large-group']),
  })
  .refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    { message: 'endDate must be on or after startDate', path: ['endDate'] }
  )

export type ValidatedTripInputs = z.infer<typeof TripInputsSchema>
