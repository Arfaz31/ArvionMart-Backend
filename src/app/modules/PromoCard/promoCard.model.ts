import mongoose, { Schema, Document, model } from 'mongoose'
import { IPromoCard } from './promoCard.interface'

const PromoCardSchema = new Schema<IPromoCard>(
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
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'INACTIVE',
    },
  },
  {
    timestamps: true,
  }
)

export const PromoCard = model<IPromoCard>('PromoCard', PromoCardSchema)
