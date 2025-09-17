import { z } from 'zod'

const SecondarySubcategorySchemaValidation = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  secondarySubcategoryName: z
    .string()
    .min(1, 'Secondary subcategory name is required.')
    .trim(),
  subcategory: z.string().refine(id => /^[a-fA-F0-9]{24}$/.test(id), {
    message: 'Invalid subcategory ID format.',
  }),
})

const updateSecondarySubcategorySchemaValidation = z.object({
  slug: z.string().optional(),
  secondarySubcategoryName: z
    .string()
    .min(1, 'Secondary subcategory name is required.')
    .trim()
    .optional(),
  subcategory: z
    .string()
    .refine(id => /^[a-fA-F0-9]{24}$/.test(id), {
      message: 'Invalid subcategory ID format.',
    })
    .optional(),
})

export const SecondarySubcategoryValidation = {
  SecondarySubcategorySchemaValidation,
  updateSecondarySubcategorySchemaValidation,
}
