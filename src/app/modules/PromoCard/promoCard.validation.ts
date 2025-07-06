import { z } from 'zod'

const PromoBannerSchema = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
})

export const PromoBannerValidation = {
  PromoBannerSchema,
}
