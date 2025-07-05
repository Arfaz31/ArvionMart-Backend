import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PaymentService } from './payment.service'
import httpStatus from 'http-status'

const initPayment = catchAsync(async (req, res) => {
  const { transactionId } = req.params

  const result = await PaymentService.initPayment(transactionId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payment initialized successfully',
    data: result,
  })
})

const validatedPayment = async (req: Request, res: Response) => {
  const result = await PaymentService.validatePayment(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payment validated successfully',
    data: result,
  })
}

const confirmationMessage = async (req: Request, res: Response) => {
  const query = req.query
  const transactionId = query.transactionId
  const status = query.status

  res.send(`<h1>Payment ${status} ${transactionId} </h1>`)
}

export const PaymentController = {
  initPayment,
  validatedPayment,
  confirmationMessage,
}
