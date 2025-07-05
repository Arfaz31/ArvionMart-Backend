import { Response } from 'express'

interface IResponse<T> {
  statusCode: number
  success?: boolean
  message: string
  meta?: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
  data: T
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: true,
    message: data.message,
    meta: data.meta,
    data: data.data,
  })
}

export default sendResponse
