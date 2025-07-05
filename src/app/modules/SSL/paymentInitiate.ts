import config from '../../config'
import axios from 'axios'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'

const initiatePayment = async (findOrder: any, margeAllName: any) => {
  try {
    const data = {
      store_id: config.ssl.store_id,
      store_passwd: config.ssl.store_pass,
      total_amount: findOrder?.totalPrice,
      currency: 'BDT',
      tran_id: findOrder?.transactionId, // use unique tran_id for each api call
      success_url: `https://shoes-sever.vercel.app/payment/conformation?transactionId=${findOrder?.transactionId}&status=success`,
      fail_url: `https://shoes-sever.vercel.app/payment/conformation?transactionId=${findOrder?.transactionId}&status=fail`,
      cancel_url: config.ssl.cancel_url,
      ipn_url: 'https://shoes-sever.vercel.app/api/v1/payment/ipn',
      shipping_method: 'Courier',
      product_name: margeAllName,
      product_category: findOrder?.orderItems[0]?.category,
      product_profile: 'general',
      cus_name: findOrder?.customerName,
      cus_email: findOrder?.email,
      cus_add1: findOrder?.address,
      cus_add2: findOrder?.address,
      cus_city: findOrder?.city,
      cus_state: findOrder?.city,
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: findOrder?.contactNumber,
      cus_fax: '01711111111',
      ship_name: findOrder?.customerName,
      ship_add1: findOrder?.address,
      ship_add2: findOrder?.address,
      ship_city: findOrder?.city,
      ship_state: findOrder?.city,
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    }

    const response = await axios({
      method: 'post',
      url: config.ssl.ssl_payment_api,
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    return response.data
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment initiate failed')
  }
}

const validatedPayment = async (payload: any) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_pass}&format=json`,
    })

    return res.data
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment validation failed')
  }
}

export const SSLService = {
  initiatePayment,
  validatedPayment,
}
