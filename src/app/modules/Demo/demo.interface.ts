import { Types } from 'mongoose'

export interface IDemo {
  name: string
  description: string
  category: Types.ObjectId
  price: number
  isPublished: boolean
}
