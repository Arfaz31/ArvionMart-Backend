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
  purchasePrice: z.number().min(0),
  variant: ObjectIdSchema,
  size: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
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
  deductPoints: z.number().optional(),
  addPoints: z.number().optional(),
  paymentMethod: z.string().min(1),
  shippingPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  noteFromCustomer: z.string().optional(),
})

export const UpdateOrderValidationSchema = z.object({
  customerInfo: CustomerInfoValidationSchema.partial().optional(),
  orderItems: z.array(OrderItemValidationSchema).optional(),
  deductPoints: z.number().optional(),
  addPoints: z.number().optional(),
  paymentMethod: z.string().optional(),
  shippingPrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
  isPaid: z.boolean().optional(),
  orderStatus: z
    .enum(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .optional(),
  deliveryStatus: z.string().optional(),
  deliveredDate: z.date().optional(),
})

const AdminCustomerInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  contactNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid contact number'),
  address: z.string().min(1, 'Address is required'),
})

// Admin order creation schema
export const createOrderValidationSchemaForAdmin = z.object({
  customer: AdminCustomerInfoSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),

  order: z.object({
    customerInfo: CustomerInfoValidationSchema,
    orderItems: z.array(OrderItemValidationSchema).min(1),
    deductPoints: z.number().optional(),
    addPoints: z.number().optional(),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    shippingPrice: z.number().min(0),
    totalPrice: z.number().min(0),
    transactionId: z.string().optional(),
    noteFromCustomer: z.string().optional(),
  }),
})
