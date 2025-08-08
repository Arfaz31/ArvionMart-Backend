import { Schema } from 'mongoose'
import { model } from 'mongoose'
import { IStory } from './story.interface'

const StorySchema = new Schema<IStory>(
  {
    order: {
      type: Number,
      required: [true, 'Order is required'],
      unique: true,
    },
    title: {
      type: String,
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
    brnadId: {
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
      default: 'INACTIVE',
    },
  },
  {
    timestamps: true,
  }
)

export const Story = model<IStory>('Story', StorySchema)
