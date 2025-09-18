import { Types } from 'mongoose'

export interface IStory {
  order: number
  image: string
  title?: string
  brandSlug?: string
  categorySlug?: string
  subcategorySlug?: string
  secondarySubcategorySlug?: string
  categoryId?: Types.ObjectId
  subcategoryId?: Types.ObjectId
  secondarySubcategoryId?: Types.ObjectId
  productId?: Types.ObjectId
  brnadId?: Types.ObjectId
  isDeleted: boolean
  status: 'ACTIVE' | 'INACTIVE'
}
