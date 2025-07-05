import mongoose, { Schema } from 'mongoose'
import { ISubcategory } from './subcategory.interface'

const subcategorySchema = new Schema<ISubcategory>(
  {
    subcategoryName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    metaTags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
)

export const Subcategory = mongoose.model<ISubcategory>(
  'Subcategory',
  subcategorySchema
)
