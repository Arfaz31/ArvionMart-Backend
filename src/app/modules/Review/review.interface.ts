import { Types } from 'mongoose'

export interface IReview {
  productId: Types.ObjectId
  customerId: Types.ObjectId
  rating: number
  comment: string
  reviewDate: Date
  likes?: number
  dislikes?: number
}
