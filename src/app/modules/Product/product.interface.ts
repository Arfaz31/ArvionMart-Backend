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
  isNewArrival?: boolean
  isFeatured?: boolean
  isTrending?: boolean
  isLatest?: boolean
  isBestSelling?: boolean
  isMostViewed?: boolean
  isFlashSale?: boolean
  variant?: Types.ObjectId[]
  barCodeNumber: number
  bestSellingProduct: number
  points?: number
}
