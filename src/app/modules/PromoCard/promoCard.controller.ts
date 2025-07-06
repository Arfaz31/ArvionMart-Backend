import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PromoBannerService } from './promoCard.service'
import httpStatus from 'http-status'

const createPromoBannerIntoDB = catchAsync(async (req, res) => {
  const result = await PromoBannerService.createPromoBanner(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'PromoBanner created successfully',
    data: result,
  })
})

const getAllPromoBannerDB = catchAsync(async (req, res) => {
  const result = await PromoBannerService.getPromoBanner(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Prmotional Banner get succesfully ',
    meta: result.count,
    data: result.result,
  })
})

export const PromoBannerController = {
  createPromoBannerIntoDB,
  getAllPromoBannerDB,
}
