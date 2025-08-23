import { z } from 'zod'

const blogSchemaValidation = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string(),
})

const updateBlogSchemaValidation = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().optional(),
})

export const BlogValidation = {
  blogSchemaValidation,
  updateBlogSchemaValidation,
}
