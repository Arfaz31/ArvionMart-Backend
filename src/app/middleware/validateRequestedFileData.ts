import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

// export const validateRequestedFileData = (schema: AnyZodObject) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (req.body.data) {
//         const parsedData = JSON.parse(req.body.data)
//         req.body = schema.parse(parsedData)
//       }
//       next()
//     } catch (error: any) {
//       next(error)
//     }
//   }
// }

export const validateRequestedFileData = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        const parsedData = JSON.parse(req.body.data)
        const result = schema.parse(parsedData)

        // ✅ Merge instead of replace
        req.body = {
          ...req.body,
          ...result,
        }
      }
      next()
    } catch (error: any) {
      next(error)
    }
  }
}
