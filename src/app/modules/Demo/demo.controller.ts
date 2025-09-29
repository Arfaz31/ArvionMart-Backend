import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { DemoService } from './demo.service'

const createDemoData = catchAsync(async (req, res) => {
  const result = await DemoService.createDemoData(req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Demo data created successfully',
    data: result,
  })
})

const getAllData = catchAsync(async (req, res) => {
  const result = await DemoService.getAllData(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'All demo data retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getSingleData = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await DemoService.getSingleData(id)
  res.header('cache-control', 'public,max-age=60') // http cache control for 1 min
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Single demo data retrieved successfully',
    data: result,
  })
})

const updateDemoData = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await DemoService.updateDemoData(id, req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Demo data updated successfully',
    data: result,
  })
})

const deleteDemoData = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await DemoService.deleteDemoData(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Demo data deleted successfully',
    data: result,
  })
})

export const DemoController = {
  createDemoData,
  getAllData,
  getSingleData,
  updateDemoData,
  deleteDemoData,
}
