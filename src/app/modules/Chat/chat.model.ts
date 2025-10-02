import mongoose, { Schema } from 'mongoose'
import { IChat } from './chat.interface'

const ChatSchema = new Schema<IChat>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Closed'],
      default: 'Open',
    },
    lastMessage: {
      type: String,
    },
  },
  { timestamps: true }
)

const Chat = mongoose.model<IChat>('Chat', ChatSchema)

export default Chat
