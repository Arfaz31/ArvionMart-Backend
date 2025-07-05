import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.config'

const removeExtension = (filename: string) => {
  return filename.split('.').slice(0, -1).join('.')
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    public_id: (_req, file) =>
      Math.random().toString(36).substring(2) +
      '-' +
      Date.now() +
      '-' +
      file.fieldname +
      '-' +
      removeExtension(file.originalname),
  },
})

const upload = multer({ storage })

export const updloadSingleImage = (itemImage: string) => {
  return upload.single(itemImage)
}

export const uploadMultipleImages = (
  fields: { name: string; maxCount: number }[]
) => {
  return upload.fields(fields)
}
