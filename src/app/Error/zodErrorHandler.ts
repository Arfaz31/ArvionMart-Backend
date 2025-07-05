import { ZodError, ZodIssue } from 'zod'
import config from '../config'
import { TErrorSource } from '../interface/error'

export const handleZodError = (error: ZodError) => {
  const errorSources: TErrorSource = error.issues.map((issues: ZodIssue) => {
    return {
      path: issues.path[issues.path.length - 1],
      message: issues.message,
    }
  })

  const statusCode = 400

  return {
    statusCode,
    message:
      config.node_env === 'development'
        ? 'Zod Validation Error'
        : 'Validation Error',
    errorSources,
  }
}
