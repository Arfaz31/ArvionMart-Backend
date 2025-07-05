import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { TErrorSource } from '../interface/error'
import config from '../config'
import { handleZodError } from '../Error/zodErrorHandler'
import { handleValidationError } from '../Error/validationErrorHandler'
import { handleCastError } from '../Error/handleCastError'
import { handleDuplicateError } from '../Error/handleDuplicateError'
import { AppError } from '../Error/AppError'

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  //setting default
  let statusCode = 500
  let message = 'Something went wrong'

  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ]

  if (error instanceof ZodError) {
    const simplifiedErrors = handleZodError(error)
    statusCode = simplifiedErrors?.statusCode
    message = simplifiedErrors?.message
    errorSources = simplifiedErrors?.errorSources
  } else if (error?.name === 'ValidationError') {
    const simplifiedErrors = handleValidationError(error)
    statusCode = simplifiedErrors?.statusCode
    message = simplifiedErrors?.message
    errorSources = simplifiedErrors?.errorSources
  } else if (error?.name === 'CastError') {
    const simplifiedErrors = handleCastError(error)
    statusCode = simplifiedErrors?.statusCode
    message = simplifiedErrors?.message
    errorSources = simplifiedErrors?.errorSources
  } else if (error?.code === 11000) {
    const simplifiedErrors = handleDuplicateError(error)
    statusCode = simplifiedErrors?.statusCode
    message = simplifiedErrors?.message
    errorSources = simplifiedErrors?.errorSources
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode
    message = error?.message
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ]
  } else if (error instanceof Error) {
    message = error?.message
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ]
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    ...(config.node_env !== 'production' && { stack: error?.stack }),
  })
}

export default globalErrorHandler
