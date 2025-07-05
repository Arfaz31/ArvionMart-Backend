import { Router } from 'express'
import { ReviewController } from './review.controller'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'

const router = Router()

router.post(
  '/create-review',
  auth(UserRole.customer),
  ReviewController.createReviewIntoDB
)

router.get('/product/:productId', ReviewController.getReviewsByProduct)

router.patch(
  '/update/:reviewId',
  auth(UserRole.customer),
  ReviewController.updateReviewByCustomer
)

router.delete(
  '/delete/:reviewId',
  auth(UserRole.customer, UserRole.admin, UserRole.superAdmin),
  ReviewController.deleteReviewByCustomer
)

export const ReviewRoutes = router
