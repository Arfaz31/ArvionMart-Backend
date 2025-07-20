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

const updateBannerIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const payload = req.body
  const file = req.file

  const result = await BannerService.updateBanner(id, payload, file)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Banner updated successfully',
    data: result,
  })
})

const deleteBannerFromDB = catchAsync(async (req, res) => {
  const id = req.params.id

  const result = await BannerService.deleteBanner(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Banner deleted successfully',
    data: result,
  })
})

export const BannerController = {
  createBannerIntoDB,
  getAllBanerFromDB,
  updateBannerIntoDB,
  deleteBannerFromDB,
}
