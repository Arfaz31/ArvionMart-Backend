import { z } from 'zod'

const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')

// Validate each order item
const OrderItemValidationSchema = z.object({
  productId: ObjectIdSchema,
  productSKU: z.string().min(1),
  productName: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().optional(),
  discount: z.number().min(0).optional(),
  sellingPrice: z.number().min(0),
  variant: ObjectIdSchema,
  size: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().int().positive(),
})

// Validate customer info
const CustomerInfoValidationSchema = z.object({
  customerId: ObjectIdSchema,
  customerName: z.string().min(1),
  contactNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid contact number'),
  email: z.string().email().optional(),
  city: z.string().min(1),
  district: z.string().min(1),
  address: z.string().min(5),
})

export const CreateOrderValidationSchema = z.object({
  customerInfo: CustomerInfoValidationSchema,
  orderItems: z.array(OrderItemValidationSchema).min(1),
  transactionId: z.string().optional(),
  paymentMethod: z.string().min(1),
  shippingPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
  paymentInfo: z.any().optional(),
})

export const UpdateOrderValidationSchema = z.object({
  customerInfo: CustomerInfoValidationSchema.partial().optional(),
  orderItems: z.array(OrderItemValidationSchema).optional(),
  transactionId: z.string().optional(),
  paymentMethod: z.string().optional(),
  shippingPrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
  paymentTransactionId: z.string().optional(),
  paymentInfo: z.any().optional(),
  isPaid: z.boolean().optional(),
  orderStatus: z
    .enum(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .optional(),
  deliveryStatus: z.string().optional(),
  deliveredDate: z.date().optional(),
  cancelledRequest: z.boolean().optional(),
  cancelledDate: z.date().optional(),
  cancelledReason: z.string().optional(),
  noteFromAdmin: z.string().optional(),
})
