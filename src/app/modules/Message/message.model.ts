import mongoose, { Schema } from 'mongoose'
import { IMessage } from './message.interface'

const MessageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
    },
    imageUrls: {
      type: [String],
    },
  },
  { timestamps: true }
)

const Message = mongoose.model<IMessage>('Message', MessageSchema)

export default Message
