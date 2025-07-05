import { NextFunction, Request, RequestHandler, Response } from 'express'

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    new Promise(resolve => resolve(fn(req, res, next))).catch(error =>
      next(error)
    )
  }
}

export default catchAsync
