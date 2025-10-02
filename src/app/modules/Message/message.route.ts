import { Router } from 'express'
import { UserRole } from '../User/user.contant'
import auth from '../../middleware/auth'
import MessageController from './message.controller'
import { uploadMultipleImages } from '../../config/cloudinary/multer.config'

const router = Router()

router.post(
  '/add-message',
  auth(UserRole.customer, UserRole.admin, UserRole.superAdmin),
  uploadMultipleImages([{ name: 'images', maxCount: 5 }]),
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
