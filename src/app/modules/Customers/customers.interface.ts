import { Types } from 'mongoose'

export interface ICustomer {
  fullName: string
  user: Types.ObjectId
  email: string
  contactNumber: string
  profileImage?: string
  address: string
  isDeleted: boolean
}
