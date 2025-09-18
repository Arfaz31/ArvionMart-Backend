import { Types } from 'mongoose'

export interface IPromoCard {
  bannerImage: string
  categorySlug?: string
  subcategorySlug?: string
  secondarySubcategorySlug?: string
  categoryId?: Types.ObjectId
  subcategoryId?: Types.ObjectId
  secondarySubcategoryId?: Types.ObjectId
  productId?: Types.ObjectId
  isDeleted?: boolean
  status: 'ACTIVE' | 'INACTIVE'
}
