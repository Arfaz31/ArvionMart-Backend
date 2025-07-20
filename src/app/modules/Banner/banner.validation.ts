import { z } from 'zod'

const bannerSchemaValidation = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
})

const updateBannerSchemaValidation = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const BannerValidation = {
  bannerSchemaValidation,
  updateBannerSchemaValidation,
}
