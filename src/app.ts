import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import httpStatus from 'http-status'
import middlewareRoutes from './app/routes'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import { notFoundRoutes } from './app/middleware/notFoundRoutes'
import { PaymentController } from './app/modules/Payment/payment.controller'

const app: Application = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
}

app.use(cors(corsOptions))

app.use('/api/v1', middlewareRoutes)
app.use('/payment', PaymentController.confirmationMessage)

app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    statusCode: httpStatus.OK,
    success: true,
    message: 'ArvionMart server is running successfully',
  })
})

app.use(globalErrorHandler)
app.use(notFoundRoutes)

export default app
