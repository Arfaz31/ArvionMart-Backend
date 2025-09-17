import { z } from 'zod'

const CategoryValidationSchema = z.object({
  categoryName: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name cannot exceed 100 characters'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),

  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  metaTags: z.array(z.string()),
  flagSize: z.array(z.string()).optional(),
  flagColor: z.boolean().optional(),
  flagCapacity: z.boolean().optional(),
  flagInternalStorage: z.boolean().optional(),
  flagOperatingSystem: z.boolean().optional(),
  flagRam: z.boolean().optional(),
})

const UpdateCategoryValidationSchema = z.object({
  categoryName: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  metaTags: z.array(z.string()).optional(),
  flagSize: z.array(z.string()).optional(),
  flagColor: z.boolean().optional(),
  flagCapacity: z.boolean().optional(),
  flagInternalStorage: z.boolean().optional(),
  flagOperatingSystem: z.boolean().optional(),
  flagRam: z.boolean().optional(),
})

export const CategoryValidation = {
  CategoryValidationSchema,
  UpdateCategoryValidationSchema,
}
