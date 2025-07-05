import { z } from 'zod'

const adminSchemaValidation = z.object({
  password: z.string({
    required_error: 'Password is required',
  }),
  admin: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email format'),
    contactNumber: z
      .string()
      .min(11, 'Contact number must be at least 11 digits'),
    emergencyContact: z
      .string()
      .min(11, 'Emergency contact must be at least 11 digits'),
    gender: z.enum(['male', 'female'], {
      required_error: 'Gender is required',
    }),
    address: z.string().min(1, 'Address is required'),
  }),
})

export const AdminValidation = {
  adminSchemaValidation,
}
