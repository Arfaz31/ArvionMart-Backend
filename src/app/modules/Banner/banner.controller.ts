import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { BannerService } from './banner.service'
import httpStatus from 'http-status'

const createBannerIntoDB = catchAsync(async (req, res) => {
  const result = await BannerService.createBanner(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Banner created successfully',
    data: result,
  })
})

const getAllBanerFromDB = catchAsync(async (req, res) => {
  const result = await BannerService.getAllBanner(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Banner get successfully',
    meta: result.count,
    data: result.bannerQuery,
  })
})

export const BannerController = {
  createBannerIntoDB,
  getAllBanerFromDB,
}
