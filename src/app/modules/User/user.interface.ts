import { TStatus } from '../../interface/common.interface'

type TRole = 'customer' | 'admin' | 'vendor' | 'superAdmin'

export interface IUser {
  email?: string
  contactNumber?: string
  password?: string
  needPasswordChange: boolean
  passwordChangedAt?: Date
  role: TRole
  status: TStatus
  isDeleted: boolean
  otp?: string
  otpExpiresAt?: Date
}
