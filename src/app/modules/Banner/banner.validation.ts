import { z } from 'zod'

const bannerSchemaValidation = z.object({
  order: z.number().min(1),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

const updateBannerSchemaValidation = z.object({
  order: z.number().min(1).optional(),
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
