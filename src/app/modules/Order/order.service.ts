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
import { ICustomer } from '../Customers/customers.interface'
import { generateUserId } from '../User/user.service'
import { IUser } from '../User/user.interface'
import { UserRole } from '../User/user.contant'
import { User } from '../User/user.model'
import { Customers } from '../Customers/customers.model'

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

const createOrderByAdmin = async (
  password: string,
  customerPayload: ICustomer,
  orderPayload: IOrder
) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    let user = await User.findOne({
      _id: orderPayload.customerInfo.customerId,
    }).session(session)

    let customer

    if (!user) {
      // Step 1: Create User
      const userId = generateUserId(customerPayload.fullName)

      const userData: Partial<IUser> = {
        userId,
        email: customerPayload.email,
        contactNumber: customerPayload.contactNumber,
        password,
        role: UserRole.customer,
      }

      const [createdUser] = await User.create([userData], { session })

      if (!createdUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed')
      }

      user = createdUser

      // Step 2: Create Customer
      customerPayload.user = createdUser._id
      const [createdCustomer] = await Customers.create([customerPayload], {
        session,
      })

      if (!createdCustomer) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Customer creation failed')
      }

      customer = createdCustomer
    } else {
      // Step 3: Use existing user
      customer = await Customers.findOne({ user: user._id }).session(session)

      if (!customer) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Customer info not found for existing user'
        )
      }
    }

    // Step 4: Prepare Order
    orderPayload.transactionId = generateTransactionId()
    orderPayload.orderNumber = generateOrderNumber()

    const [order] = await Order.create([orderPayload], { session })

    // Step 5: Update Stock
    for (const item of orderPayload.orderItems) {
      const variant = await Variant.findById(item.variant).session(session)
      const product = await Product.findById(item.productId).session(session)

      if (!variant || !product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product or variant not found for productId: ${item.productId}`
        )
      }

      if (item.size) {
        const sizeEntry = variant.size?.find(s => s.size === item.size)
        if (!sizeEntry) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Size "${item.size}" not found in variant ${variant._id}`
          )
        }
        if (sizeEntry.quantity < item.quantity) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Insufficient stock for size "${item.size}" in variant ${variant._id}`
          )
        }
        sizeEntry.quantity -= item.quantity
      } else {
        if ((variant.quantity ?? 0) < item.quantity) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Insufficient variant quantity for variant ${variant._id}`
          )
        }
        variant.quantity = (variant.quantity ?? 0) - item.quantity
      }

      if ((product.quantity ?? 0) < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient product stock for ${product.productName}`
        )
      }

      product.quantity = (product.quantity ?? 0) - item.quantity

      await variant.save({ session })
      await product.save({ session })
    }

    await session.commitTransaction()
    return order
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const getAllOrdersInfo = async (query: Record<string, unknown>) => {
  const fromDate = query.fromDate as string
  const toDate = query.toDate as string
  const orderStatus = query.orderStatus as string

  // Build a filter for QueryBuilder + raw filtering later
  const rawFilter: Record<string, any> = {}

  // Date range filter
  if (fromDate || toDate) {
    rawFilter.createdAt = {}
    if (fromDate) rawFilter.createdAt.$gte = new Date(fromDate)
    if (toDate) rawFilter.createdAt.$lte = new Date(toDate)
  }

  // Order status filter
  if (orderStatus) {
    rawFilter.orderStatus = orderStatus
  }

  // Combine into query
  const initialQuery = Order.find({ ...rawFilter })

  const builder = new QueryBuilder(initialQuery, query)
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields()

  const orders = await builder.modelQuery
  const count = await new QueryBuilder(
    Order.find({ ...rawFilter }),
    query
  ).countTotal()

  // Grouping and counting
  const pendingOrderData = orders.filter(
    order => order.orderStatus === 'PENDING' && order.cancelledRequest === false
  )
  const shippedOrderData = orders.filter(
    order => order.orderStatus === 'SHIPPED'
  )
  const deliveredOrderData = orders.filter(
    order => order.orderStatus === 'DELIVERED'
  )
  const cancelledOrderData = orders.filter(
    order => order.orderStatus === 'CANCELLED'
  )

  const totalOrderCount = orders.length
  const totalPendingOrderCount = pendingOrderData.length
  const totalShippedOrderCount = shippedOrderData.length
  const totalDeliveredOrderCount = deliveredOrderData.length
  const totalCancelledOrderCount = cancelledOrderData.length

  // Total sales from delivered + paid
  const deliveredAndPaidOrders = deliveredOrderData.filter(
    order => order.isPaid
  )
  const totalSales = deliveredAndPaidOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  )

  // Total profit
  const totalProfit = deliveredAndPaidOrders.reduce((acc, order) => {
    const cost = order.orderItems.reduce(
      (sum, item) => sum + item.purchasePrice * item.quantity,
      0
    )
    return acc + (order.totalPrice - cost)
  }, 0)

  return {
    meta: count,
    pendingOrderData,
    shippedOrderData,
    deliveredOrderData,
    cancelledOrderData,
    totalOrderCount,
    totalPendingOrderCount,
    totalShippedOrderCount,
    totalDeliveredOrderCount,
    totalCancelledOrderCount,
    totalSales,
    totalProfit,
  }
}

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

const getCancelRequestOrderData = async (query: Record<string, unknown>) => {
  const initialQuery = Order.find({ cancelledRequest: true })

  const result = await new QueryBuilder(initialQuery, query)
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(
    Order.find({ cancelledRequest: true }),
    query
  ).countTotal()

  return {
    count,
    result,
  }
}

const updateOrder = async (orderId: string, updatePayload: Partial<IOrder>) => {
  const order = await Order.findById(orderId)
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found')
  }

  // Only update fields that exist in updatePayload
  Object.entries(updatePayload).forEach(([key, value]) => {
    if (value !== undefined && key in order) {
      ;(order as any)[key] = value
    }
  })

  await order.save()
  return order
}

export const OrderService = {
  createOrder,
  createOrderByAdmin,
  getAllOrdersInfo,
  getMyOrders,
  getSingleOrder,
  updateDeliverStatus,
  requestCancelOrder,
  reviewCancelRequest,
  getCancelRequestOrderData,

  updateOrder,
}
