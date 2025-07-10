import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ReviewService } from './review.service'
import httpStatus from 'http-status'

const createReviewIntoDB = catchAsync(async (req, res) => {
  const result = await ReviewService.createReview(req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Review created successfully',
    data: result,
  })
})

const getReviewsByProduct = catchAsync(async (req, res) => {
  const productId = req.params.productId
  // console.log('productId', productId)

  const result = await ReviewService.getReviewsByProduct(productId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Reviews fetched successfully',
    data: result,
  })
})

const updateReviewByCustomer = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId
  const customerId = req.user._id
  const result = await ReviewService.updateReviewByCustomer(
    reviewId,
    customerId,
    req.body
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review updated successfully',
    data: result,
  })
})

const deleteReviewByCustomer = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId
  const userId = req.user._id
  const userRole = req.user.role
  const result = await ReviewService.deleteReviewByCustomer(
    reviewId,
    userId,
    userRole
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review deleted successfully',
    data: result,
  })
})

export const ReviewController = {
  createReviewIntoDB,
  getReviewsByProduct,
  updateReviewByCustomer,
  deleteReviewByCustomer,
}
