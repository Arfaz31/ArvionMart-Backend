import { Router } from 'express'
import { AuthController } from './auth.controller'
import { UserRole } from '../User/user.contant'
import auth from '../../middleware/auth'
import rateLimit from 'express-rate-limit'
import validateData from '../../middleware/validateRequest'
import { AuthValidation } from './auth.validation'

const router = Router()

// OTP পাঠানোর জন্য রেট লিমিটার: ১৫ মিনিটে সর্বোচ্চ 10 বার
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message:
    'Too many OTP requests from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
})

// OTP ভেরিফাই করার জন্য রেট লিমিটার: ৫ মিনিটে সর্বোচ্চ ১০ বার ভুল প্রচেষ্টা
const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message:
    'Too many incorrect OTP attempts from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

router.post(
  '/login',
  validateData(AuthValidation.loginSchemaValidation),
  otpRequestLimiter,
  AuthController.login
)
router.post(
  '/verify-otp',
  validateData(AuthValidation.otpSchemaValidation),
  otpVerifyLimiter,
  AuthController.verifyOtp
)

router.post('/google/login', AuthController.googleLogin)
router.post('/check-token', AuthController.checkToken)
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
