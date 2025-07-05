import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { Product } from '../Product/product.model'
import { searchableFields } from './order.constant'
import { IOrder } from './order.interface'
import { Order } from './order.model'

import { Variant } from '../Variant/variant.model'
import { generateOrderNumber, generateTransactionId } from './order.utility'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'

const createOrder = async (payload: IOrder) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  payload.transactionId = generateTransactionId()
  payload.orderNumber = generateOrderNumber()

  try {
    // Step 1: Create Order
    const [order] = await Order.create([payload], { session })

    // Step 2: Process all items in the order
    for (const item of payload.orderItems) {
      const variant = await Variant.findById(item.variant).session(session)
      const product = await Product.findById(item.productId).session(session)

      if (!variant || !product) {
        throw new Error(
          `Product or variant not found for productId: ${item.productId}`
        )
      }

      // Step 3: Handle size-based reduction
      if (item.size) {
        const sizeEntry = variant.size?.find(s => s.size === item.size)
        if (!sizeEntry) {
          throw new Error(
            `Size "${item.size}" not found for variant ${variant._id}`
          )
        }

        if (sizeEntry.quantity < item.quantity) {
          throw new Error(
            `Not enough stock for size "${item.size}" in variant ${variant._id}`
          )
        }

        sizeEntry.quantity -= item.quantity
      } else {
        // Step 4: Handle simple quantity reduction
        if ((variant.quantity ?? 0) < item.quantity) {
          throw new Error(
            `Not enough variant quantity for variant ${variant._id}`
          )
        }

        variant.quantity = (variant.quantity ?? 0) - item.quantity
      }

      // Step 5: Update main product quantity
      if ((product.quantity ?? 0) < item.quantity) {
        throw new Error(`Not enough product stock for ${product.productName}`)
      }

      product.quantity = (product.quantity ?? 0) - item.quantity

      // Save updates
      await variant.save({ session })
      await product.save({ session })
    }

    // Step 6: Commit transaction
    await session.commitTransaction()
    return order
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const getOrders = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(Order.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery
  const count = await new QueryBuilder(Order.find(), query).countTotal()
  return {
    count,
    result,
  }
}

//get order from the cusotmer
// const getOrderCustomerFromDB = async (req: Request) => {
//   const user = req.user

//   const builderQuery = await new QueryBuilder(
//     Order.find({ customerId: user._id }),
//     req.query
//   )
//     .search(['orderNumber', 'customerName', 'email'])
//     .filter()
//     .sort()
//     .pagination()
//     .fields().modelQuery

//   const count = await new QueryBuilder(
//     Order.find({ customerId: user._id }),
//     req.query
//   ).countTotal()
//   return {
//     count,
//     builderQuery,
//   }
// }

export const getMyOrders = async (userId: string) => {
  const orders = await Order.find({ 'customerInfo.customerId': userId }).sort({
    createdAt: -1,
  })
  return orders
}

export const getSingleOrder = async (orderId: string) => {
  const order = await Order.findOne({
    _id: orderId,
    // 'customerInfo.customerId': userId,
  })
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found or access denied')
  }
  return order
}

//update deliver status
const updateDeliverStatus = async (orderId: string, deliverStatus: string) => {
  const result = await Order.findOneAndUpdate(
    { _id: orderId },
    { deliveryStatus: deliverStatus },
    { new: true }
  )

  if (result?.deliveryStatus === 'inTransit') {
    await Order.findOneAndUpdate({ _id: orderId }, { orderStatus: 'SHIPPED' })
  } else if (result?.deliveryStatus === 'delivered') {
    await Order.findOneAndUpdate({ _id: orderId }, { orderStatus: 'DELIVERED' })
  }

  return result
}

// Customer requests cancellation
const requestCancelOrder = async (
  orderId: string,
  user: any,
  reason: string
) => {
  const order = await Order.findById(orderId)
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found')

  if (!order.customerInfo.customerId.equals(user._id)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to cancel this order'
    )
  }

  if (order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Order cannot be cancelled in current state'
    )
  }

  order.cancelledRequest = true
  order.cancelledReason = reason
  await order.save()

  return order
}

// Admin approves or declines cancellation
const reviewCancelRequest = async (
  orderId: string,
  action: 'APPROVE' | 'DECLINE',
  noteFromAdmin: string
) => {
  const order = await Order.findById(orderId)
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found')

  if (!order.cancelledRequest) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No cancellation request to review'
    )
  }

  if (action === 'APPROVE') {
    order.orderStatus = 'CANCELLED'
    order.cancelledDate = new Date()
    order.noteFromAdmin = noteFromAdmin
    order.cancelledRequest = false
  } else if (action === 'DECLINE') {
    order.noteFromAdmin = noteFromAdmin
    order.cancelledRequest = false
  }

  await order.save()
  return order
}

const getReports = async () => {
  // Total orders (excluding cancelled)
  const totalOrderCount = await Order.countDocuments({
    orderStatus: { $ne: 'CANCELLED' },
  })

  // Total cancelled orders
  const totalCancelledOrders = await Order.countDocuments({
    orderStatus: 'CANCELLED',
  })

  // Total profit from paid orders
  const paidOrders = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: null,
        totalProfit: { $sum: '$totalPrice' },
      },
    },
  ])

  const totalProfit = paidOrders[0]?.totalProfit || 0

  return {
    totalOrderCount,
    totalCancelledOrders,
    totalProfit,
  }
}

export const OrderService = {
  createOrder,
  getOrders,
  getMyOrders,
  getSingleOrder,
  updateDeliverStatus,
  requestCancelOrder,
  reviewCancelRequest,
  getReports,
}
