import { z } from 'zod'

const StorySchemaValidation = z.object({
  order: z.number().min(1),
  title: z.string().optional(),
  brandSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  subcategorySlug: z.string().optional(),
  secondarySubcategorySlug: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  brandId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

const updateStorySchemaValidation = z.object({
  order: z.number().min(1).optional(),
  title: z.string().optional(),
  brandSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  subcategorySlug: z.string().optional(),
  secondarySubcategorySlug: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  secondarySubcategoryId: z.string().optional(),
  productId: z.string().optional(),
  brandId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const StoryValidation = {
  StorySchemaValidation,
  updateStorySchemaValidation,
}
