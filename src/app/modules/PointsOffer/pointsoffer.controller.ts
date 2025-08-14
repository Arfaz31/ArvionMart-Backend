import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PointsOfferService } from './pointsoffer.services'
import httpStatus from 'http-status'

const createPointsOffer = catchAsync(async (req, res) => {
  const result = await PointsOfferService.createPointsOffer(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Points offer created successfully',
    data: result,
  })
})

const getAllPointsOffer = catchAsync(async (req, res) => {
  const result = await PointsOfferService.getAllPointsOffer(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Points offers retrieved successfully',
    data: result,
  })
})

const updatePointsOffer = catchAsync(async (req, res) => {
  const result = await PointsOfferService.updatePointsOffer(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Points offer updated successfully',
    data: result,
  })
})

const deletePointsOffer = catchAsync(async (req, res) => {
  const result = await PointsOfferService.deletePointsOffer(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Points offer deleted successfully',
    data: result,
  })
})

export const PointsOfferController = {
  createPointsOffer,
  getAllPointsOffer,
  updatePointsOffer,
  deletePointsOffer,
}
