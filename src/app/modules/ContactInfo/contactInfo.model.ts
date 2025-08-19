import { model, Schema } from 'mongoose'
import { IContactInfo } from './contactinfo.interface'

const contactInfoSchema = new Schema<IContactInfo>(
  {
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const ContactInfo = model<IContactInfo>('ContactInfo', contactInfoSchema)
