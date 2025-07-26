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
    message: 'Promo Banner get succesfully ',
    meta: result.count,
    data: result.result,
  })
})

const updatePromoBannerIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const payload = req.body
  const file = req.file

  const result = await PromoBannerService.updatePromoCard(id, payload, file)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promo Banner updated successfully',
    data: result,
  })
})

const deletePromoBannerFromDB = catchAsync(async (req, res) => {
  const id = req.params.id

  const result = await PromoBannerService.deletePormoCard(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promo Banner deleted successfully',
    data: result,
  })
})

export const PromoBannerController = {
  createPromoBannerIntoDB,
  getAllPromoBannerDB,
  updatePromoBannerIntoDB,
  deletePromoBannerFromDB,
}
