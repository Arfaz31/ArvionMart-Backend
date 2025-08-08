import { z } from 'zod'

const PromoCardSchema = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const PromoCardValidation = {
  PromoCardSchema,
}
