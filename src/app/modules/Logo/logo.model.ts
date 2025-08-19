import { model, Schema } from 'mongoose'
import { ILogo } from './logo.interface'

const LogoSchema = new Schema<ILogo>(
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

export const Logo = model<ILogo>('Logo', LogoSchema)
