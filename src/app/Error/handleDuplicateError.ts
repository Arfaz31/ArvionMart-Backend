import mongoose from 'mongoose'
import { TErrorSource } from '../interface/error'

export const handleDuplicateError = (error: any) => {
  const match = error.message.match(/"([^"]*)"/)
  const extractedMessage = match && match[1]
  const errorSources: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    message: 'Duplicate Entry',
    errorSources,
  }
}
