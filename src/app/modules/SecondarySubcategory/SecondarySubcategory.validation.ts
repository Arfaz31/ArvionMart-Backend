import { z } from 'zod'

const SecondarySubcategorySchemaValidation = z.object({
  secondarySubcategoryName: z
    .string()
    .min(1, 'Secondary subcategory name is required.')
    .trim(),
  subcategory: z.string().refine(id => /^[a-fA-F0-9]{24}$/.test(id), {
    message: 'Invalid subcategory ID format.',
  }),
})

const updateSecondarySubcategorySchemaValidation = z.object({
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
