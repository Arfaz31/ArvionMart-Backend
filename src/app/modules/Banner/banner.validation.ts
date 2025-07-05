import { z } from 'zod'

const bannerSchemaValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  buttonText: z.string().min(1, 'Button text is required'),
  buttonLink: z.string(),
})

export const BannerValidation = {
  bannerSchemaValidation,
}
