import { z } from 'zod'

const PromoCardSchema = z.object({
  categorySlug: z.string().optional(),
  subcategorySlug: z.string().optional(),
  secondarySubcategorySlug: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const PromoCardValidation = {
  PromoCardSchema,
}
