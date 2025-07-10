import { Types } from 'mongoose'

type TOrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export type TOrderItem = {
  productId: Types.ObjectId
  productSKU: string
  productName: string
  category: string
  brand?: string
  discount?: number
  purchasePrice: number
  sellingPrice: number
  variant: Types.ObjectId
  size?: string
  color?: string
  quantity: number
  image?: string
}

export type TCustomerInfo = {
  customerId: Types.ObjectId
  customerName: string
  contactNumber: string
  email?: string
  city: string
  district: string
  address: string
}

export interface IOrder {
  orderNumber: string
  customerInfo: TCustomerInfo
  orderItems: TOrderItem[]
  transactionId?: string
  paymentMethod: string
  shippingPrice: number
  totalPrice: number
  paymentStatus: string
  paymentTransactionId?: string
  paymentInfo?: any
  isPaid: boolean
  orderStatus: TOrderStatus
  deliveryStatus?: string
  deliveredDate?: Date
  cancelledRequest: boolean
  cancelledDate?: Date
  cancelledReason?: string
  noteFromAdmin?: string
}
