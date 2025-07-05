import { Types } from 'mongoose'

type TGender = 'male' | 'female'

export interface IAdmin {
  fullName: string
  user: Types.ObjectId
  email: string
  contactNumber: string
  emergencyContact: string
  gender: TGender
  profileImage?: string
  dateOfBirth?: string
  address: string
  isDeleted: boolean
}
