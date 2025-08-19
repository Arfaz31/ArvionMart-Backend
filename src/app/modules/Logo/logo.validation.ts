import { z } from 'zod'

const logoSchemaValidation = z.object({
  order: z.number().min(1),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

const updateLogoSchemaValidation = z.object({
  order: z.number().min(1).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const LogoValidation = {
  logoSchemaValidation,
  updateLogoSchemaValidation,
}
