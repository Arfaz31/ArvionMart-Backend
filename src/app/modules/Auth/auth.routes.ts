import { Router } from 'express'
import { AuthController } from './auth.controller'

const router = Router()

router.post('/login', AuthController.login)
router.post('/login-vendor', AuthController.loginVendor)
router.post('/refresh-token', AuthController.generateToken)
router.post('/forget-password', AuthController.forgetPassword)
router.post('/reset-password', AuthController.resetPassword)

export const AuthRoutes = router
