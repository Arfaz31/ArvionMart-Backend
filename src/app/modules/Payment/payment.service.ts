import axios from 'axios'
import { Order } from '../Order/order.model'

const productNames = (orderItem: any[]): string => {
  const productName = orderItem
    .map((ordItem: any) => ordItem.productNumber)
    .join(', ')

  return productName
}

const initPayment = async (transactionId: string) => {
  const findOrder = await Order.findOne({ transactionId })

  const margeAllName = findOrder && productNames(findOrder?.orderItems)

  const userPaymentPayload = {
    transactionId: findOrder?.transactionId,
    storeId: 'Cosmetices-a2f8c687',
    margeAllName,
    findOrder,
  }

  try {
    const sendRequset = await axios({
      method: 'POST',
      url: 'https://centralize-paymentgetway.vercel.app/payment/init-payment',
      headers: {
        'Content-Type': 'application/json',
      },
      data: userPaymentPayload,
    })

    // console.log('velo request', sendRequset.data?.data)

    return {
      gatewayPageURL: sendRequset.data?.data,
    }
  } catch (error: any) {
    console.log('error', error)
    throw new Error(error)
  }
}

const validatePayment = async (payload: any) => {
  const result = await Order.findOneAndUpdate(
    { transactionId: payload.tran_id },
    {
      paymentStatus: 'PAID',
      isPaid: true,
      paymentTransactionId: payload.bank_tran_id,
      paymentInfo: payload,
    },
    { new: true }
  )

  if (!result) {
    throw new Error('Order not found or update failed')
  }

  // if (result.paymentStatus === 'PAID' && result.isPaid) {
  //   try {
  //     const sendSmsForCustomer = await SmsService.sendSms(result)
  //     console.log('SMS Sent:', sendSmsForCustomer)
  //   } catch (error: any) {
  //     console.error('Failed to send SMS:', error.message)
  //   }
  // }

  return {
    message: 'Payment success',
  }
}

export const PaymentService = {
  initPayment,
  validatePayment,
}
