import { Types } from 'mongoose'

export interface IBrandOffer {
  name: string
  image: string
  brandId?: Types.ObjectId
  productId?: Types.ObjectId
  isDeleted: boolean
  isTopBrand: boolean
  offer?: number
  status: 'ACTIVE' | 'INACTIVE'
}

export type TBrandOfferStatus = 'ACTIVE' | 'INACTIVE'
