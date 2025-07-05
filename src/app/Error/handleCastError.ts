import mongoose from 'mongoose'
import { TErrorSource } from '../interface/error'

export const handleCastError = (error: mongoose.Error.CastError) => {
  const errorSources: TErrorSource = [
    {
      path: error?.path,
      message: error?.message,
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    message: 'Invalid Id',
    errorSources,
  }
}
