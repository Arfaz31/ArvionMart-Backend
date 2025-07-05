import { Schema, model } from 'mongoose'
import { IBrand } from './brand.interface'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'

const BrandSchema = new Schema<IBrand>(
  {
    brandName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brandLogo: {
      type: String,
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
  },
  {
    timestamps: true,
  }
)

BrandSchema.pre('save', async function (next) {
  const brand = this
  const isBrandExist = await Brand.findOne({ brandName: brand.brandName })
  if (isBrandExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Brand already exist')
  }
  next()
})

export const Brand = model<IBrand>('Brand', BrandSchema)
