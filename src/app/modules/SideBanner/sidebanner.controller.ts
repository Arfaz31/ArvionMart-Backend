import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { SideBannerService } from './sidebanner.services'

const createSideBannerIntoDB = catchAsync(async (req, res) => {
  const result = await SideBannerService.createSideBanner(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'SideBanner created successfully',
    data: result,
  })
})

const getAllSideBannersFromDB = catchAsync(async (req, res) => {
  const result = await SideBannerService.getAllSideBanners(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'SideBanners retrieved successfully',
    meta: result.count,
    data: result.sideBannerQuery,
  })
})

const getActiveSideBannerFromDB = catchAsync(async (req, res) => {
  const result = await SideBannerService.getActiveSideBanner()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Active SideBanner retrieved successfully',
    data: result,
  })
})

const updateSideBannerIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const payload = req.body
  const file = req.file

  const result = await SideBannerService.updateSideBanner(id, payload, file)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'SideBanner updated successfully',
    data: result,
  })
})

const deleteSideBannerIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await SideBannerService.deleteSideBanner(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'SideBanner deleted successfully',
    data: result,
  })
})

export const SideBannerController = {
  createSideBannerIntoDB,
  getAllSideBannersFromDB,
  getActiveSideBannerFromDB,
  updateSideBannerIntoDB,
  deleteSideBannerIntoDB,
}
