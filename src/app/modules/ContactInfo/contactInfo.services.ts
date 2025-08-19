import { Request } from 'express'
import { IContactInfo } from './contactinfo.interface'
import { ContactInfo } from './contactInfo.model'

const createContactInfo = async (payload: IContactInfo) => {
  const result = await ContactInfo.create(payload)
  return result
}

const getContactInfo = async () => {
  const result = await ContactInfo.find()
  return result
}

const updateContactInfo = async (req: Request) => {
  const { id } = req.params
  const payload = req.body.data
  const result = await ContactInfo.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

const deleteContactInfo = async (id: string) => {
  const result = await ContactInfo.findByIdAndDelete(id)
  return result
}

export const ContactInfoService = {
  createContactInfo,
  getContactInfo,
  updateContactInfo,
  deleteContactInfo,
}
