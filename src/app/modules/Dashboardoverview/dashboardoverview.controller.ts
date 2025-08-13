import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { DashboardOverviewService } from './dashboardoverview.service'
import httpStatus from 'http-status'

//today order amount
const todayOrderAmountFromDB = catchAsync(async (req, res) => {
  const result = await DashboardOverviewService.todayOrderAmount()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Today order amount fetched successfully',
    data: result,
  })
})

//total order amount
const totalOrderAmountFromDB = catchAsync(async (req, res) => {
  const result = await DashboardOverviewService.totalOrderAmount()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Total order amount fetched successfully',
    data: result,
  })
})

//monthly order amount
const monthlyOrderAmountFromDB = catchAsync(async (req, res) => {
  const result = await DashboardOverviewService.monthlyOrderAmount()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Monthly order amount fetched successfully',
    data: result,
  })
})

//previous month order amount
const previousMonthOrderAmountFromDB = catchAsync(async (req, res) => {
  const result = await DashboardOverviewService.previousMonthOrderAmount()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Previous month order amount fetched successfully',
    data: result,
  })
})

//calculated  order
const totalOrderFromDB = catchAsync(async (req, res) => {
  const result = await DashboardOverviewService.totalOrderCount()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'total order  fetched successfully',
    data: result,
  })
})

const getFullYearSales = catchAsync(async (req, res) => {
  const result = await DashboardOverviewService.getYearlySalesData()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'FullYearSales fetched successfully',
    data: result,
  })
})

const getBestSellingProduct = catchAsync(async (req, res) => {
  const result = await DashboardOverviewService.getBestSellingProduct()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Best selling product fetched successfully',
    data: result,
  })
})

export const DashboardOverviewController = {
  todayOrderAmountFromDB,
  totalOrderAmountFromDB,
  monthlyOrderAmountFromDB,
  previousMonthOrderAmountFromDB,
  totalOrderFromDB,
  getFullYearSales,
  getBestSellingProduct,
}
