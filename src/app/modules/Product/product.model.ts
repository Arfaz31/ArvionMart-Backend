import { Schema, model } from 'mongoose'
import { IProduct } from './product.interface'

const ProductSchema = new Schema<IProduct>(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    // slug: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   lowercase: true,
    //   trim: true,
    // },
    sku: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description should be at least 10 characters'],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
    },
    secondarySubcategory: {
      type: Schema.Types.ObjectId,
      ref: 'SecondarySubcategory',
    },
    quantity: {
      type: Number,
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isLatest: {
      type: Boolean,
      default: false,
    },
    isBestSelling: {
      type: Boolean,
      default: false,
    },
    isMostViewed: {
      type: Boolean,
      default: false,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: [Schema.Types.ObjectId],
      ref: 'Variant',
    },
    barCodeNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    bestSellingProduct: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Index for faster Filter
ProductSchema.index({ category: 1 })
ProductSchema.index({ subcategory: 1 })
ProductSchema.index({ brand: 1 })

ProductSchema.index({ isActive: 1, isFeatured: 1 })
ProductSchema.index({ isActive: 1, isNewArrival: 1 })
ProductSchema.index({ isActive: 1, createdAt: -1 })

// Text search: It will improve search performance
ProductSchema.index({ productName: 'text', description: 'text' })

export const Product = model<IProduct>('Product', ProductSchema)
