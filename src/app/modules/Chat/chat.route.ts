import { Router } from 'express'

import { ChatController } from './chat.controller'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'

const router = Router()

router.get(
  '/customer/:customerId',
  auth(UserRole.customer),
  ChatController.getCustomerChat
)

router.get(
  '/admin/all',
  auth(UserRole.admin, UserRole.superAdmin),
  ChatController.getAdminChats
)

export const ChatRoutes = router
