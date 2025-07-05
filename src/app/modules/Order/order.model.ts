import { Schema, model } from 'mongoose'
import { IOrder, TOrderItem, TCustomerInfo } from './order.interface'

// Order Item Schema
const orderItemSchema = new Schema<TOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    productSKU: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    discount: {
      type: Number,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    variant: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Variant',
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
)

// Customer Info Schema
const customerInfoSchema = new Schema<TCustomerInfo>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    customerName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

// Main Order Schema
const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerInfo: {
      type: customerInfoSchema,
      required: true,
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
    },
    transactionId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
    paymentTransactionId: {
      type: String,
    },
    paymentInfo: {
      type: Schema.Types.Mixed,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      required: true,
      default: 'PENDING',
    },
    deliveryStatus: {
      type: String,
    },
    deliveredDate: {
      type: Date,
    },
    cancelledRequest: {
      type: Boolean,
      default: false,
    },
    cancelledDate: {
      type: Date,
    },
    cancelledReason: {
      type: String,
    },
    noteFromAdmin: {
      type: String,
    },
  },
  { timestamps: true }
)

export const Order = model<IOrder>('Order', orderSchema)
