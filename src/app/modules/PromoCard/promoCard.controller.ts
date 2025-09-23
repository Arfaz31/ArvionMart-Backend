import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PromoCardService } from './promoCard.service'
import httpStatus from 'http-status'

const createPromoBannerIntoDB = catchAsync(async (req, res) => {
  const result = await PromoCardService.createPromoCard(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'PromoBanner created successfully',
    data: result,
  })
})

const getAllPromoBannerDB = catchAsync(async (req, res) => {
  const result = await PromoCardService.getPromoCard(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promo Banner get succesfully ',
    meta: result.count,
    data: result.result,
  })
})

const getActivePromoCard = catchAsync(async (req, res) => {
  const result = await PromoCardService.getActivePromoCard()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promo Banner get successfully',
    data: result,
  })
})

const updatePromoBannerIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const payload = req.body
  const file = req.file

  const result = await PromoCardService.updatePromoCard(id, payload, file)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promo Banner updated successfully',
    data: result,
  })
})

const deletePromoBannerFromDB = catchAsync(async (req, res) => {
  const id = req.params.id

  const result = await PromoCardService.deletePormoCard(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Promo Banner deleted successfully',
    data: result,
  })
})

export const PromoCardController = {
  createPromoBannerIntoDB,
  getAllPromoBannerDB,
  getActivePromoCard,
  updatePromoBannerIntoDB,
  deletePromoBannerFromDB,
}
