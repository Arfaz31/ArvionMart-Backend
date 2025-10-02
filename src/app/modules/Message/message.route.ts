import { Router } from 'express'
import { UserRole } from '../User/user.contant'
import auth from '../../middleware/auth'
import MessageController from './message.controller'
import { uploadMultipleImages } from '../../config/cloudinary/multer.config'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { messageValidationSchema } from './message.validation'

const router = Router()

// router.post(
//   '/add-message',
//   auth(UserRole.customer, UserRole.admin, UserRole.superAdmin),
//   uploadMultipleImages([{ name: 'images', maxCount: 5 }]),
//   validateRequestedFileData(messageValidationSchema),
//   MessageController.createMessage
// )

// Raw request logger middleware
// const logRawRequest = (req: any, res: any, next: any) => {
//   console.log('=== RAW REQUEST (Before Multer) ===')
//   console.log('Content-Type:', req.headers['content-type'])
//   console.log('req.body (before multer):', req.body)
//   console.log('req.files (before multer):', req.files)
//   console.log('req.headers:', req.headers)

//   // Check if it's multipart/form-data
//   if (req.headers['content-type']?.includes('multipart/form-data')) {
//     console.log('✅ multipart/form-data detected - files should be present')
//   } else {
//     console.log('❌ NOT multipart/form-data - no files will be uploaded')
//   }

//   next()
// }

router.post(
  '/add-message',
  auth(UserRole.customer, UserRole.admin, UserRole.superAdmin),
  uploadMultipleImages([{ name: 'images', maxCount: 5 }]),
  validateRequestedFileData(messageValidationSchema),
  MessageController.createMessage
)

router.post(
  '/add-message-socket',
  auth(UserRole.customer, UserRole.admin, UserRole.superAdmin),
  MessageController.createMessageFromSocket
)

router.get(
  '/:chatId',
  auth(UserRole.customer, UserRole.admin, UserRole.superAdmin),
  MessageController.getAllMessages
)

export const MessageRoutes = router
