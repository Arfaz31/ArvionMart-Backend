import { Types } from 'mongoose'

export interface ISideBanner {
  order: number
  image: string
  categoryId?: Types.ObjectId
  subcategoryId?: Types.ObjectId
  secondarySubcategoryId?: Types.ObjectId
  productId?: Types.ObjectId
  brandId?: Types.ObjectId
  isDeleted: boolean
  status: 'ACTIVE' | 'INACTIVE'
}
