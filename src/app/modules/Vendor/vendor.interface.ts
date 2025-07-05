// Vendor Interface for multi-vendor e-commerce platform in Bangladesh
import { Types } from 'mongoose'

export type TStatus = 'pending' | 'active' | 'suspended' | 'blacklisted'

// Business Type Enum
export enum BusinessType {
  INDIVIDUAL = 'Individual',
  PARTNERSHIP = 'Partnership',
  CORPORATION = 'Corporation',
  LIMITED_LIABILITY = 'Limited Liability',
}

// Address Interface
export interface IAddress {
  fullAddress: string
  district: string
  division: string
  postalCode: string
}

// Bank Account Interface
export interface IBankAccount {
  accountName: string
  accountNumber: string
  bankName: string
  branchName: string
  routingNumber?: string
  checkCopy: string
  isVerified: boolean
}

// Mobile Banking Interface
export interface IMobileBanking {
  provider: 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'SureCash' | 'Other'
  accountNumber: string
  accountType: 'Personal' | 'Merchant'
  isVerified: boolean
}

// Main Vendor Interface
export interface IVendor {
  user: Types.ObjectId
  description?: string
  email: string
  contactNumber: string
  emergencyPhoneNumber?: string
  businessType?: BusinessType
  registrationNumber?: string
  tinNumber?: string // Tax Identification Number
  binNumber?: string // Business Identification Number
  vatRegistration?: string
  businessAddress?: IAddress
  ownerName?: string
  vendorId: string
  ownerNID?: string // National ID Card number
  profileImage?: string
  logo?: string
  coverImage?: string
  galleryImages?: string[]
  bankAccount?: IBankAccount
  mobileBanking?: IMobileBanking
  commissionRate?: number
  isActive: boolean
  isVerified?: boolean
  isPremium: boolean
  status: TStatus
  isDeleted: boolean
}
