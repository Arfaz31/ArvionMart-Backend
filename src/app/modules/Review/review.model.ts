import { Schema, model, Document } from 'mongoose'
import { IReview } from './review.interface'

// Define Review Schema
const reviewSchema = new Schema<IReview>({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
})

export const Review = model<IReview>('Review', reviewSchema)
