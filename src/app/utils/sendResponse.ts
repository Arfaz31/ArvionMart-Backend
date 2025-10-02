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
    links?: Record<string, string>
  }
  data: T
  links?: any[]
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  const response: any = {
    statusCode: data.statusCode,
    success: true,
    message: data.message,
  }

  if (data.meta) {
    response.meta = data.meta
  }

  if (data.links) {
    response.links = data.links
  }

  response.data = data.data

  res.status(data.statusCode).json(response)
}

export default sendResponse

// import { Response } from 'express'

// interface IResponse<T> {
//   statusCode: number
//   success?: boolean
//   message: string
//   meta?: {
//     page: number
//     limit: number
//     total: number
//     totalPage: number
//   }
//   data: T
// }

// const sendResponse = <T>(res: Response, data: IResponse<T>) => {
//   res.status(data.statusCode).json({
//     statusCode: data.statusCode,
//     success: true,
//     message: data.message,
//     meta: data.meta,
//     data: data.data,
//   })
// }

// export default sendResponse
