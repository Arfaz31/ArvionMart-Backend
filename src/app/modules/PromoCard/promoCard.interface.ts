import { Types } from 'mongoose'

export interface IPromoBanner {
  bannerImage: string
  categoryId?: Types.ObjectId
  subcategoryId?: Types.ObjectId
  secondarySubcategoryId?: Types.ObjectId
  productId?: Types.ObjectId
  isDeleted?: boolean
}
