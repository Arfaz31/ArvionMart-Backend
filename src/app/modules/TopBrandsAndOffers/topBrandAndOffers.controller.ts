import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { BrandOfferService } from './topBrandAndOffers.services'

const createBrandOffer = catchAsync(async (req, res) => {
  const result = await BrandOfferService.createBrandOffer(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Brand offer created successfully',
    data: result,
  })
})

const getAllBrandOffers = catchAsync(async (req, res) => {
  const result = await BrandOfferService.getAllBrandOffers(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand offers retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getTopBrandOffers = catchAsync(async (req, res) => {
  const result = await BrandOfferService.getTopBrandOffers()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top brand offers retrieved successfully',
    data: result,
  })
})

const updateBrandOffer = catchAsync(async (req, res) => {
  const result = await BrandOfferService.updateBrandOffer(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand offer updated successfully',
    data: result,
  })
})

const deleteBrandOffer = catchAsync(async (req, res) => {
  const result = await BrandOfferService.deleteBrandOffer(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand offer deleted successfully',
    data: result,
  })
})

export const BrandOfferController = {
  createBrandOffer,
  getAllBrandOffers,
  getTopBrandOffers,
  updateBrandOffer,
  deleteBrandOffer,
}
