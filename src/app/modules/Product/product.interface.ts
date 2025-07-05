import { Types } from 'mongoose'

export interface IProduct {
  productName: string
  sku: string
  // slug: string
  // vendor: Types.ObjectId
  description: string
  brand?: Types.ObjectId
  category?: Types.ObjectId
  subcategory?: Types.ObjectId
  secondarySubcategory?: Types.ObjectId
  quantity?: number
  stock: number
  isActive: boolean
  isNewArrival: boolean
  variant?: Types.ObjectId[]
}
