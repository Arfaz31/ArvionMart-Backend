import { z } from 'zod'

const SizeSchema = z.object({
  size: z.string({
    required_error: 'Size is required',
  }),
  quantity: z
    .number({
      required_error: 'Quantity is required for each size',
      invalid_type_error: 'Quantity must be a number',
    })
    .min(0, 'Quantity cannot be negative'),
})

const CreatedVariantSchema = z.object({
  size: z.array(SizeSchema).optional(), // now correctly typed as array of size objects
  color: z.string().optional(),
  features: z.array(z.string()).default([]),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .min(0, 'Quantity cannot be negative')
    .optional(), // optional if size[] is provided
  purchasePrice: z
    .number({
      required_error: 'Purchase price is required',
      invalid_type_error: 'Purchase price must be a number',
    })
    .min(0, 'Price cannot be negative'),
  sellingPrice: z
    .number({
      required_error: 'Selling Price is required',
      invalid_type_error: 'Selling Price must be a number',
    })
    .min(0, 'Selling price cannot be negative'),
  discount: z.number().min(0, 'Discount cannot be negative').default(0),
  productId: z.string({
    required_error: 'Product ID is required',
  }),
  productSKU: z.string({
    required_error: 'Product SKU is required',
  }),
})

const updateVariantSchema = z.object({
  size: z.array(SizeSchema).optional(),
  color: z.string().optional(),
  features: z.array(z.string()).optional(),
  quantity: z.number().min(0, 'Quantity cannot be negative').optional(),
  purchasePrice: z.number().min(0, 'Price cannot be negative').optional(),
  sellingPrice: z
    .number()
    .min(0, 'Selling price cannot be negative')
    .optional(),
  discount: z.number().min(0, 'Discount cannot be negative').optional(),
  productId: z.string().optional(),
  productSKU: z.string().optional(),
})

export const VariantValidation = {
  CreatedVariantSchema,
  updateVariantSchema,
}
