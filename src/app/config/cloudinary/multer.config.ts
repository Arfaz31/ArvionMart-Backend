import { Request } from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.config'

const removeExtension = (filename: string): string => {
  return filename.split('.').slice(0, -1).join('.')
}

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed.'))
  }
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: 'image',
    public_id: (req: Request, file: Express.Multer.File) =>
      Math.random().toString(36).substring(2) +
      '-' +
      Date.now() +
      '-' +
      file.fieldname +
      '-' +
      removeExtension(file.originalname),

    transformation: [
      { width: 1000, height: 1000, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  } as any,
})

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
})

export const updloadSingleImage = (itemImage: string) => {
  return upload.single(itemImage)
}

export const uploadMultipleImages = (
  fields: { name: string; maxCount: number }[]
) => {
  return upload.fields(fields)
}

// import multer from 'multer'
// import { CloudinaryStorage } from 'multer-storage-cloudinary'
// import cloudinary from './cloudinary.config'

// const removeExtension = (filename: string) => {
//   return filename.split('.').slice(0, -1).join('.')
// }

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     public_id: (_req, file) =>
//       Math.random().toString(36).substring(2) +
//       '-' +
//       Date.now() +
//       '-' +
//       file.fieldname +
//       '-' +
//       removeExtension(file.originalname),

//   },

// })

// const upload = multer({ storage })

// export const updloadSingleImage = (itemImage: string) => {
//   return upload.single(itemImage)
// }

// export const uploadMultipleImages = (
//   fields: { name: string; maxCount: number }[]
// ) => {
//   return upload.fields(fields)
// }
