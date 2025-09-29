// src/app.ts
import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
// import rateLimit from 'express-rate-limit'
import middlewareRoutes from './app/routes'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import { notFoundRoutes } from './app/middleware/notFoundRoutes'
import { PaymentController } from './app/modules/Payment/payment.controller'

const app: Application = express()

// Middleware Setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://arvion-mart-frontend-rho.vercel.app',
      'https://arvionmart.vercel.app',
      'https://arvion-mart.vercel.app',
    ],
    credentials: true,
    exposedHeaders: [
      'x-trace-id',
      'x-correlation-id',
      'ETag',
      'if-none-match',
      'if-match',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
)
app.use(helmet())

// 1. Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again later.',
// })
// app.use(limiter)

// Routes
app.use('/api/v1', middlewareRoutes)
app.use('/payment', PaymentController.confirmationMessage)

app.get('/', (_, res) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'ArvionMart server is running successfully',
  })
})

// Error Handlers
app.use(globalErrorHandler)
app.use(notFoundRoutes)

export default app
