import { model, Schema } from 'mongoose'
import { IVariant } from './variant.interface'

const SizeSchema = new Schema(
  {
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
  },
  { _id: false }
)

const VariantSchema = new Schema<IVariant>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productSKU: {
      type: String,
      required: true,
      index: true,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price cannot be negative'],
      index: true,
    },
    color: {
      type: String,
      index: true,
    },
    size: {
      type: [SizeSchema],
      default: undefined,
    },

    quantity: { type: Number, min: [0, 'Quantity cannot be negative'] },
    purchasePrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    features: { type: [String], default: [] },
    image: { type: [String], default: [] },
    unit: { type: String, required: true },
    capacity: String,
    internalStorage: String,
    operatingSystem: String,
    ram: String,
  },
  { timestamps: true }
)

export const Variant = model<IVariant>('Variant', VariantSchema)

// import { model, Schema } from 'mongoose'
// import { IVariant } from './variant.interface'

// const SizeSchema = new Schema(
//   {
//     size: { type: String, required: true },
//     quantity: { type: Number, required: true, min: 0 },
//   },
//   { _id: false }
// )

// const VariantSchema = new Schema<IVariant>(
//   {
//     size: {
//       type: [SizeSchema],
//       default: undefined,
//     },
//     quantity: {
//       type: Number,
//       min: [0, 'Quantity cannot be negative'],
//     },
//     color: {
//       type: String,
//     },
//     purchasePrice: {
//       type: Number,
//       required: [true, 'Purchase price is required'],
//       min: [0, 'Price cannot be negative'],
//     },
//     sellingPrice: {
//       type: Number,
//       required: [true, 'Selling price is required'],
//       min: [0, 'Price cannot be negative'],
//     },
//     discount: {
//       type: Number,
//       default: 0,
//     },
//     features: {
//       type: [String],
//       default: [],
//     },
//     image: {
//       type: [String],
//       default: [],
//     },
//     productId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true,
//     },
//     productSKU: {
//       type: String,
//       required: true,
//     },
//     unit: {
//       type: String,
//       required: true,
//     },
//     capacity: {
//       type: String,
//     },
//     internalStorage: {
//       type: String,
//     },
//     operatingSystem: {
//       type: String,
//     },
//     ram: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// )

// export const Variant = model<IVariant>('Variant', VariantSchema)
