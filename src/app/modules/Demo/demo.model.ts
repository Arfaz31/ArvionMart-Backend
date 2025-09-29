import { model, Schema } from 'mongoose'
import { IDemo } from './demo.interface'

const demoSchema = new Schema<IDemo>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Demo = model<IDemo>('Demo', demoSchema)
