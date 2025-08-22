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
    facebookLink: {
      type: String,
      required: false,
    },
    instagramLink: {
      type: String,
      required: false,
    },
    youtubeLink: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

export const ContactInfo = model<IContactInfo>('ContactInfo', contactInfoSchema)
