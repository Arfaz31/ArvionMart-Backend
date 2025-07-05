import { z } from 'zod'

const customerSchemaValidation = z.object({
  password: z.string({
    required_error: 'Password is required',
  }),
  customers: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email format'),
    contactNumber: z
      .string()
      .min(11, 'Contact number must be at least 11 digits'),
    emergencyContact: z
      .string()
      .min(11, 'Emergency contact must be at least 11 digits'),
    address: z.string().min(1, 'Address is required'),
  }),
})

export const UserValidation = {
  customerSchemaValidation,
}
