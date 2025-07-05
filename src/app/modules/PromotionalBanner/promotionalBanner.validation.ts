import { z } from 'zod'

export const PromotionalBannerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  discount: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%'),
})

export const PromotionalBannerValidation = {
  PromotionalBannerSchema,
}
