import { z } from 'zod'

export const SideBannerSchema = z.object({
  order: z
    .number({ required_error: 'Order is required' })
    .int('Order must be an integer')
    .min(1, 'Order must be greater than 0'),
  brandSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  subcategorySlug: z.string().optional(),
  secondarySubcategorySlug: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  brandId: z.string().optional(),

  isDeleted: z.boolean().optional(),

  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

const updateSideBannerSchema = z.object({
  order: z
    .number()
    .int('Order must be an integer')
    .min(1, 'Order must be greater than 0')
    .optional(),
  brandSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  subcategorySlug: z.string().optional(),
  secondarySubcategorySlug: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  brandId: z.string().optional(),

  isDeleted: z.boolean().optional(),

  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const SideBannerValidation = {
  SideBannerSchema,
  updateSideBannerSchema,
}
