import { model, Schema } from 'mongoose'
import { ISideBanner } from './sidebanner.interface'

const SideBannerSchema = new Schema<ISideBanner>(
  {
    order: {
      type: Number,
      required: [true, 'Order is required'],
      unique: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
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

export const SideBanner = model<ISideBanner>('SideBanner', SideBannerSchema)
