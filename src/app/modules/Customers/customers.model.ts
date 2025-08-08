import { model, Schema } from 'mongoose'
import { ICustomer } from './customers.interface'

const customerSchema = new Schema<ICustomer>(
  {
    fullName: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
    },
    contactNumber: {
      type: String,
    },

    profileImage: {
      type: String,
    },
    address: {
      type: String,
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

export const Customers = model<ICustomer>('Customer', customerSchema)
