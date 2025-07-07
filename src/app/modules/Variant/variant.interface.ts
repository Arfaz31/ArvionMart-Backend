import { Types } from 'mongoose'

export interface ISizeQuantity {
  size: string
  quantity: number
}

export interface IVariant {
  size?: ISizeQuantity[] // for clothing, shoes
  quantity?: number // for cosmetics or simple items
  color?: string
  purchasePrice: number
  sellingPrice: number
  discount?: number
  features?: string[]
  image?: string[]
  productId: Types.ObjectId
  productSKU: string
  unit: string
}
