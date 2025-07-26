import { z } from 'zod'

export const PromotionalBannerSchema = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  brandId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const PromotionalBannerValidation = {
  PromotionalBannerSchema,
}
