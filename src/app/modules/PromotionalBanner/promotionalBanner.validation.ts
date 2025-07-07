import { z } from 'zod'

export const PromotionalBannerSchema = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  brandId: z.string().optional(),
})

export const PromotionalBannerValidation = {
  PromotionalBannerSchema,
}
