import { Request } from 'express'
import QueryBuilder from '../../builder/QueryBuilder'
import { Review } from './review.model'
import { User } from '../User/user.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'

const createReview = (req: Request) => {
  const user = req.user
  const payload = req.body
  const isUserExist = User.findOne({ _id: user._id })
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }
  payload.user = user._id
  const result = Review.create(payload)
  return result
}

const getReviewsByProduct = async (productId: string) => {
  const reviews = await Review.find({ productId })
    .populate('customerId', 'name email') // optionally populate user details
    .sort({ reviewDate: -1 })
  return reviews
}

const updateReviewByCustomer = async (
  reviewId: string,
  customerId: string,
  updateData: Partial<{ rating: number; comment: string }>
) => {
  const review = await Review.findOne({ _id: reviewId, customerId })

  if (!review) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Review not found or not authorized'
    )
  }

  const updatedReview = await Review.findOneAndUpdate(
    { _id: reviewId, customerId },
    updateData,
    { new: true, runValidators: true }
  )

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
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      customerId: userId,
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
  getReviewsByProduct,
  updateReviewByCustomer,
  deleteReviewByCustomer,
}
