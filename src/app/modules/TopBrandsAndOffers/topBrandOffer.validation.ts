import { z } from 'zod'

const createBrandOfferValidationSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  brandId: z.string().optional(),
  productId: z.string().optional(),
  isTopBrand: z.boolean().optional(),
  offer: z.number().min(0).max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

const updateBrandOfferValidationSchema = z.object({
  name: z.string().optional(),
  brandId: z.string().optional(),
  productId: z.string().optional(),
  isTopBrand: z.boolean().optional(),
  offer: z.number().min(0).max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const BrandOfferValidation = {
  createBrandOfferValidationSchema,
  updateBrandOfferValidationSchema,
}
