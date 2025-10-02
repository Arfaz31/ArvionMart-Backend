import { Types } from 'mongoose'

export interface IMessage {
  chatId: Types.ObjectId
  senderId: Types.ObjectId
  text?: string
  imageUrls?: string[]
  createdAt?: Date
  updatedAt?: Date
}
