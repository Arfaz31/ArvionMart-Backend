import { Types } from 'mongoose'

export interface IPromotionalBanner {
  image: string
  brandSlug?: string
  categorySlug?: string
  subcategorySlug?: string
  secondarySubcategorySlug?: string
  categoryId?: Types.ObjectId
  subcategoryId?: Types.ObjectId
  secondarySubcategoryId?: Types.ObjectId
  productId?: Types.ObjectId
  brandId?: Types.ObjectId
  isDeleted: boolean
  status: 'ACTIVE' | 'INACTIVE'
}
