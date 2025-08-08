import { z } from 'zod'

const productSchemaValidation = z.object({
  productName: z.string().min(1, 'Product name is required').trim(),
  description: z
    .string()
    .min(10, 'Description should be at least 10 characters')
    .trim(),
  brand: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  secondarySubcategory: z.string().optional(),
  stock: z
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative')
    .default(0),

  isNewArrival: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})

export const updateProductSchemaValidation = z.object({
  productName: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name cannot exceed 100 characters')
    .trim()
    .optional(),

  description: z
    .string()
    .min(10, 'Description should be at least 10 characters')
    .trim()
    .optional(),

  brand: z.string().optional(), // ObjectId as string
  category: z.string().optional(),
  subcategory: z.string().optional(),
  secondarySubcategory: z.string().optional(),

  variant: z.array(z.string()).optional(), // Array of ObjectId as strings

  stock: z
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative')
    .optional(),

  isNewArrival: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export const ProductValidation = {
  productSchemaValidation,
  updateProductSchemaValidation,
}
