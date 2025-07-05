import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { OrderService } from './order.service'
import httpStatus from 'http-status'

const createOrderIntoDB = catchAsync(async (req, res) => {
  const result = await OrderService.createOrder(req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Order created successfully',
    data: result,
  })
})

const getOrderFromBD = catchAsync(async (req, res) => {
  const result = await OrderService.getOrders(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order get successfully',
    meta: result.count,
    data: result.result,
  })
})

const updateOrderDeliverStatus = catchAsync(async (req, res) => {
  const orderId = req.params.id
  const { deliverStatus } = req.body
  const result = await OrderService.updateDeliverStatus(orderId, deliverStatus)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order status updated successfully',
    data: result,
  })
})

// get customer data
// const getCustomerOrder = catchAsync(async (req, res) => {
//   const result = await OrderService.getOrderCustomerFromDB(req)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: 'Customer order get successfully',
//     meta: result.count,
//     data: result.builderQuery,
//   })
// })

const getMyOrders = catchAsync(async (req, res) => {
  const userId = req.user._id
  const orders = await OrderService.getMyOrders(userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'My orders retrieved successfully',
    data: orders,
  })
})

const getSingleOrder = catchAsync(async (req, res) => {
  // const userId = req.user._id
  const orderId = req.params.id
  const order = await OrderService.getSingleOrder(orderId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order retrieved successfully',
    data: order,
  })
})

const requestCancelOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params
  const { reason } = req.body

  const order = await OrderService.requestCancelOrder(orderId, req.user, reason)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Cancellation request submitted successfully',
    data: order,
  })
})

const reviewCancelRequest = catchAsync(async (req, res) => {
  const { orderId } = req.params
  const { action, noteFromAdmin } = req.body

  const order = await OrderService.reviewCancelRequest(
    orderId,
    action,
    noteFromAdmin
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Cancellation request ${
      action === 'APPROVE' ? 'approved' : 'declined'
    } successfully`,
    data: order,
  })
})

const getReports = catchAsync(async (req, res) => {
  const reportData = await OrderService.getReports()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order report fetched successfully',
    data: reportData,
  })
})

export const OrderController = {
  createOrderIntoDB,
  getOrderFromBD,
  updateOrderDeliverStatus,
  getMyOrders,
  getSingleOrder,
  requestCancelOrder,
  reviewCancelRequest,
  getReports,
}
