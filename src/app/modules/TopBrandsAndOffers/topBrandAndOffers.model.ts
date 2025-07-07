import { Schema, model, Types } from 'mongoose'
import { IBrandOffer } from './topBrandAndOffers.interface'

const BrandOfferSchema = new Schema<IBrandOffer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    brandId: {
      type: Types.ObjectId,
      ref: 'Brand',
    },
    productId: {
      type: Types.ObjectId,
      ref: 'Product',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isTopBrand: {
      type: Boolean,
      default: false,
    },
    offer: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
)

export const BrandOffer = model<IBrandOffer>('BrandOffer', BrandOfferSchema)
