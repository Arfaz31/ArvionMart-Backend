import { Schema } from 'mongoose'
import { model } from 'mongoose'
import { IBanner } from './banner.interface'

const BannerSchema = new Schema<IBanner>(
  {
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [1, 'Title must not be empty'],
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      minlength: [1, 'Subtitle must not be empty'],
    },
    buttonText: {
      type: String,
      required: [true, 'Button text is required'],
      minlength: [1, 'Button text must not be empty'],
    },
    buttonLink: {
      type: String,
      required: [true, 'Button link is required'],
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

export const Banner = model<IBanner>('Banner', BannerSchema)
