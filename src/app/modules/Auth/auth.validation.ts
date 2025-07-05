import { z } from 'zod'

const loginSchemaValidation = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export const AuthValidation = {
  loginSchemaValidation,
}
