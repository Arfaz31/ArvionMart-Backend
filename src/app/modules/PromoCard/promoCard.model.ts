import mongoose, { Schema, Document, model } from 'mongoose'
import { IPromoBanner } from './promoCard.interface'

const PromoBannerSchema = new Schema<IPromoBanner>(
  {
    bannerImage: {
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const PromoBanner = model<IPromoBanner>('PromoBanner', PromoBannerSchema)
