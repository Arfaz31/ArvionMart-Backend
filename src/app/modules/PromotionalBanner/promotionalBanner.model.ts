import { model, Schema } from 'mongoose'
import { IPromotionalBanner } from './promotionalBanner.interface'

const PromotionalBannerSchema = new Schema<IPromotionalBanner>(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: false,
    },
    secondarySubcategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SecondarySubcategory',
      required: false,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: false,
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
