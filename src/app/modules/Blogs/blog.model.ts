import { Schema, model } from 'mongoose'
import { IBlog } from './blog.interface'

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    blogImage: {
      type: String,
      required: [true, 'Blog image is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
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

export const Blog = model<IBlog>('Blog', BlogSchema)
