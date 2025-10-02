import { Types } from 'mongoose'

export type TChatStatus = 'Open' | 'In-Progress' | 'Closed'

export interface IChat {
  customer: Types.ObjectId
  assignedAdmin?: Types.ObjectId
  status: TChatStatus
  lastMessage?: string
  createdAt?: Date
  updatedAt?: Date
}
