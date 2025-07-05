import { model, Schema } from 'mongoose'
import { IAdmin } from './admin.interface'

const adminSchema = new Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const Admin = model<IAdmin>('Admin', adminSchema)
