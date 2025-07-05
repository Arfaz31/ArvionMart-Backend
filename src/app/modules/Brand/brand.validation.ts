import { z } from 'zod'

const BrandValidationSchema = z.object({
  brandName: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name cannot exceed 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),

  description: z.string(),
})

const UpdateBrnadValidationSchema = z.object({
  brandName: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
})

export const BrandValidation = {
  BrandValidationSchema,
  UpdateBrnadValidationSchema,
}
