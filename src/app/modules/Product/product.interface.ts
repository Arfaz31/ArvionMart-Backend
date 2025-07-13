import { Types } from 'mongoose'

export interface IProduct {
  productName: string
  sku: string
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
