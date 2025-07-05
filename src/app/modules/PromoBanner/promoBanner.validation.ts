import { z } from 'zod';

 const PromoBannerSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  discount: z.number().min(0).max(100),
});



export const PromoBannerValidation = {
  PromoBannerSchema,
};
