import { Router } from 'express'
import { AuthController } from './auth.controller'
import { UserRole } from '../User/user.contant'
import auth from '../../middleware/auth'

const router = Router()

router.post('/login', AuthController.login)
router.post('/login-vendor', AuthController.loginVendor)
router.post('/refresh-token', AuthController.generateToken)
router.post('/forget-password', AuthController.forgetPassword)
router.post('/reset-password', AuthController.resetPassword)
router.patch(
  '/update-password',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.customer),
  AuthController.updatePassword
)

export const AuthRoutes = router
