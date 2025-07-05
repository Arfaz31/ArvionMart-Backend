import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

const validateData = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error: any) {
      next(error)
    }
  }
}

export default validateData
