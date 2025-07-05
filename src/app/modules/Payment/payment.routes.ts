import { Router } from 'express'
import { PaymentController } from './payment.controller'

const router = Router()

router.post('/ipn', PaymentController.validatedPayment)

router.post('/conformation', PaymentController.confirmationMessage)

router.post('/init-payment/:transactionId', PaymentController.initPayment)

export const PaymentRoutes = router
