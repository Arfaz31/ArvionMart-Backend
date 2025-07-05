import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PromotionalBannerService } from './promotionalBanner.service'
import httpStatus from 'http-status'

const createPromotionalBannerIntoDB = catchAsync(async (req, res) => {
  const result = await PromotionalBannerService.createPromotionalBanner(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Promotional Banner created successfully',
    data: result,
  })
})

const getAllPromotionalBanerFromDB = catchAsync(async (req, res) => {
  const result = await PromotionalBannerService.getAllPromotionalBanner(
    req.query
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promotional Banner   get successfully',
    meta: result.count,
    data: result.bannerQuery,
  })
})

export const PromotionalBannerController = {
  createPromotionalBannerIntoDB,
  getAllPromotionalBanerFromDB,
}
