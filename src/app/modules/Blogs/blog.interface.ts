import { Types } from 'mongoose'

export interface IBlog {
  title: string
  description: string
  blogImage: string
  category: Types.ObjectId
  isDeleted: boolean
}
