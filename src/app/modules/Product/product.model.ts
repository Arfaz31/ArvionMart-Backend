import { Schema, model } from 'mongoose'
import { IProduct } from './product.interface'

const ProductSchema = new Schema<IProduct>(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    // slug: {
    //   type: String,
    //   required: [true, 'Slug is required'],
    //   unique: true,
    //   trim: true,
    //   lowercase: true,
    // },
    // vendor: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'Vendor',
    // },
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
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    variant: {
      type: [Schema.Types.ObjectId],
      ref: 'Variant',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ProductSchema.virtual('variants', {
//   ref: 'Variant',
//   localField: '_id',
//   foreignField: 'productId',
// })

export const Product = model<IProduct>('Product', ProductSchema)
