import { Request } from 'express'
import QueryBuilder from '../../builder/QueryBuilder'
import { Review } from './review.model'

import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import { Customers } from '../Customers/customers.model'

const createReview = async (req: Request) => {
  const user = req.user
  const payload = req.body
  const isCustomerExist = await Customers.findOne({ user: user._id })
  if (!isCustomerExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Customer not found')
  }
  payload.customerId = isCustomerExist._id
  const result = Review.create(payload)
  return result
}

const getReviewsByProduct = async (productId: string) => {
  const reviews = await Review.find({ productId })
    .populate('customerId', 'name email') // optionally populate user details
    .sort({ reviewDate: -1 })
  return reviews
}

const getAllReviews = async (query: Record<string, unknown>) => {
  const searchableFields = [
    'comment',
    'productId.productName',
    'productId.sku',
    'customerId.fullName',
    'customerId.contactNumber',
  ]

  const result = await new QueryBuilder(
    Review.find()
      .populate({ path: 'productId', select: 'productName sku' })
      .populate({
        path: 'customerId',
        select: 'fullName contactNumber address',
      }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(
    Review.find()
      .populate({ path: 'productId', select: 'productName sku' })
      .populate({ path: 'customerId', select: 'fullName contactNumber' }),
    query
  ).countTotal()

  return {
    count,
    result,
  }
}

const updateReviewByCustomer = async (
  reviewId: string,
  user: any,
  updateData: Partial<{ rating: number; comment: string }>
) => {
  let review

  // If user is admin or super admin, allow updating any review
  if (user.role === 'admin' || user.role === 'superAdmin') {
    review = await Review.findById(reviewId)
  } else {
    // Otherwise, only allow updating own review
    const isCustomerExist = await Customers.findOne({ user: user._id })
    if (!isCustomerExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Customer not found')
    }
    review = await Review.findOne({
      _id: reviewId,
      customerId: isCustomerExist._id,
    })
  }

  if (!review) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Review not found or not authorized to update'
    )
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, {
    new: true,
    runValidators: true,
  })

  return updatedReview
}

const deleteReviewByCustomer = async (
  reviewId: string,
  userId: string,
  userRole: string
) => {
  if (userRole === 'admin' || userRole === 'superAdmin') {
    const review = await Review.findOneAndDelete({ _id: reviewId })
    if (!review) {
      throw new AppError(httpStatus.NOT_FOUND, 'Review not found ')
    }
    return review
  } else {
    const isCustomerExist = await Customers.findOne({ user: userId })
    if (!isCustomerExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Customer not found')
    }
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      customerId: isCustomerExist._id,
    })
    if (!review) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Review not found or not authorized'
      )
    }
    return review
  }
}

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  updateReviewByCustomer,
  deleteReviewByCustomer,
}
