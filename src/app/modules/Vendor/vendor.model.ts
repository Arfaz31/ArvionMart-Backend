import mongoose, { model, Schema } from 'mongoose'
import {
  IAddress,
  IBankAccount,
  IMobileBanking,
  IVendor,
} from './vendor.interface'

// Address Schema (for reusability)
const addressSchema = new Schema<IAddress>({
  fullAddress: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  division: {
    type: String,
  },
  postalCode: {
    type: String,
    trim: true,
  },
})

// Bank Account Schema
const bankAccountSchema = new Schema<IBankAccount>({
  accountName: {
    type: String,
    trim: true,
  },
  accountNumber: {
    type: String,
    trim: true,
  },
  bankName: {
    type: String,
    trim: true,
  },
  branchName: {
    type: String,
    trim: true,
  },
  routingNumber: {
    type: String,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
})

// Mobile Banking Schema
const mobileBankingSchema = new Schema<IMobileBanking>({
  provider: {
    type: String,
    enum: ['bKash', 'Nagad', 'Rocket', 'Upay', 'SureCash', 'Other'],
  },
  accountNumber: {
    type: String,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ['Personal', 'Merchant'],
    default: 'Personal',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
})

// Vendor Schema
const vendorSchema = new Schema<IVendor>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^01[3-9]\d{8}$/,
        'Please provide a valid Bangladesh phone number',
      ],
    },
    emergencyPhoneNumber: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      enum: ['Individual', 'Partnership', 'Corporation', 'Limited Liability'],
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    tinNumber: {
      type: String,
      trim: true,
    },
    binNumber: {
      type: String,
      trim: true,
    },
    vatRegistration: {
      type: String,
      trim: true,
    },
    businessAddress: {
      type: addressSchema,
    },
    ownerName: {
      type: String,
      trim: true,
    },
    vendorId: {
      type: String,
      required: true,
      trim: true,
    },
    ownerNID: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    bankAccount: {
      type: bankAccountSchema,
    },
    mobileBanking: {
      type: mobileBankingSchema,
    },
    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    // Account Status
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'blacklisted'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

export const Vendor = model<IVendor>('Vendor', vendorSchema)
