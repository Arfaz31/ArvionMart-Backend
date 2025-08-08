import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { Order } from '../Order/order.model'

//today sales
const todayOrderAmount = async () => {
  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date()
  endOfDay.setUTCHours(23, 59, 59, 999)

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$totalPrice' },
        count: { $sum: 1 }, // Optional: if you want to count orders too
      },
    },
  ])

  return result.length > 0 ? result[0] : { totalAmount: 0, count: 0 }
}

//monthly sales
const monthlyOrderAmount = async () => {
  const now = new Date()
  const startOfMonthLocal = startOfMonth(now)
  const endOfMonthLocal = endOfMonth(now)

  const startOfMonthUTC = new Date(
    Date.UTC(
      startOfMonthLocal.getFullYear(),
      startOfMonthLocal.getMonth(),
      startOfMonthLocal.getDate(),
      0,
      0,
      0,
      0
    )
  )

  const endOfMonthUTC = new Date(
    Date.UTC(
      endOfMonthLocal.getFullYear(),
      endOfMonthLocal.getMonth(),
      endOfMonthLocal.getDate(),
      23,
      59,
      59,
      999
    )
  )

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfMonthUTC,
          $lte: endOfMonthUTC,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$totalPrice' },
        count: { $sum: 1 }, // Optional: if you want to count orders too
      },
    },
  ])

  return result.length > 0 ? result[0] : { totalAmount: 0, count: 0 }
}

//previous month sales
const previousMonthOrderAmount = async () => {
  const now = new Date()
  const prevMonthDate = subMonths(now, 1)
  const startOfMonthLocal = startOfMonth(prevMonthDate)
  const endOfMonthLocal = endOfMonth(prevMonthDate)

  const startOfMonthUTC = new Date(
    Date.UTC(
      startOfMonthLocal.getFullYear(),
      startOfMonthLocal.getMonth(),
      startOfMonthLocal.getDate(),
      0,
      0,
      0,
      0
    )
  )

  const endOfMonthUTC = new Date(
    Date.UTC(
      endOfMonthLocal.getFullYear(),
      endOfMonthLocal.getMonth(),
      endOfMonthLocal.getDate(),
      23,
      59,
      59,
      999
    )
  )

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfMonthUTC,
          $lte: endOfMonthUTC,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$totalPrice' },
        count: { $sum: 1 }, // Optional: if you want to count orders too
      },
    },
  ])

  return result.length > 0 ? result[0] : { totalAmount: 0, count: 0 }
}

//now calculated total order amount -- all order collection
const totalOrderAmount = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
  ])

  return result.length > 0 ? result[0] : { totalAmount: 0, count: 0 }
}

//calculate total order count -- all order collection. pendingordercount, completedordercount, cancelledordercount
const totalOrderCount = async () => {
  const totalOrder = await Order.countDocuments()

  //now calculated pending oreder count
  const pendingOrderCount = await Order.countDocuments({
    orderStatus: 'PENDING',
  })

  //now calculated completed order count
  const completedOrderCount = await Order.countDocuments({
    status: 'DELIVERED',
  })

  //now calculated cancelled order count
  const cancelledOrderCount = await Order.countDocuments({
    status: 'CANCELLED',
  })

  return {
    totalOrder,
    pendingOrderCount,
    completedOrderCount,
    cancelledOrderCount,
  }
}

//get 12 years sales report
const getYearlySalesData = async () => {
  const currentYear = new Date().getFullYear()
  const monthlySales: number[] = []

  // Loop through all 12 months (0-11)
  for (let month = 0; month < 12; month++) {
    const startDate = new Date(Date.UTC(currentYear, month, 1, 0, 0, 0, 0))
    const endDate = new Date(
      Date.UTC(currentYear, month + 1, 0, 23, 59, 59, 999)
    )

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalPrice' },
        },
      },
    ])

    // Push the amount or 0 if no sales
    monthlySales.push(result[0]?.totalAmount || 0)
  }

  return monthlySales
}

export const DashboardOverviewService = {
  todayOrderAmount,
  totalOrderAmount,
  monthlyOrderAmount,
  previousMonthOrderAmount,
  totalOrderCount,
  getYearlySalesData,
}
