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

const updatePromotionalBannerIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const payload = req.body
  const file = req.file

  const result = await PromotionalBannerService.updatePromotionalBanner(
    id,
    payload,
    file
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promotional Banner updated successfully',
    data: result,
  })
})

const deletePromotionalBannerIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await PromotionalBannerService.deletePormotionalBanner(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promotional Banner deleted successfully',
    data: result,
  })
})

export const PromotionalBannerController = {
  createPromotionalBannerIntoDB,
  getAllPromotionalBanerFromDB,
  updatePromotionalBannerIntoDB,
  deletePromotionalBannerIntoDB,
}
