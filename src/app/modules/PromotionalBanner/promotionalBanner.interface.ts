import { Types } from 'mongoose'

export interface IPromotionalBanner {
  image: string
  categoryId?: Types.ObjectId
  subcategoryId?: Types.ObjectId
  secondarySubcategoryId?: Types.ObjectId
  productId?: Types.ObjectId
  brandId?: Types.ObjectId
  isDeleted: boolean
}
