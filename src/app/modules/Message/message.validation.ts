import { z } from 'zod'

// Zod schema for validating Message input
export const messageValidationSchema = z.object({
  chatId: z.string().min(1, 'chatId is required'),
  senderId: z.string().min(1, 'senderId is required'),
  text: z.string().optional(),
})
