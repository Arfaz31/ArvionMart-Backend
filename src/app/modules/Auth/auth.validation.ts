import { z } from 'zod'

const loginSchemaValidation = z.object({
  email: z.string().email('Invalid email format'),
  // password: z.string().min(1, 'Password is required'),
})

const otpSchemaValidation = z.object({
  otp: z.string().min(1, 'OTP is required'),
  email: z.string().email('Invalid email format'),
})

export const AuthValidation = {
  loginSchemaValidation,
  otpSchemaValidation,
}
