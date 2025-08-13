import { z } from 'zod'

export const createPointsOfferSchema = z.object({
  points: z.number().min(1),
  discountAmount: z.number().min(0),
})
