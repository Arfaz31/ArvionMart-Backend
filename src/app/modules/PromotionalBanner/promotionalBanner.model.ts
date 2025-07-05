import { model, Schema } from 'mongoose'
import { IPromotionalBanner } from './promotionalBanner.interface'

const PromotionalBannerSchema = new Schema<IPromotionalBanner>(
  {
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [1, 'Title must not be empty'],
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      minlength: [1, 'Subtitle must not be empty'],
    },
    discount: {
      type: Number,
      required: [true, 'Discount is required'],
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const PromotionalBanner = model<IPromotionalBanner>(
  'PromotionalBanner',
  PromotionalBannerSchema
)
