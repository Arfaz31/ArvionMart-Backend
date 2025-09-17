import { Schema, model } from 'mongoose'
import { ISecondarySubcategory } from './SecondarySubcategory.interface'

const SecondarySubcategorySchema = new Schema<ISecondarySubcategory>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    secondarySubcategoryName: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
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

export const SecondarySubcategory = model<ISecondarySubcategory>(
  'SecondarySubcategory',
  SecondarySubcategorySchema
)
