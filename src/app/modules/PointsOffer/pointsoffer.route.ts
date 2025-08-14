import { Router } from 'express'
import { PointsOfferController } from './pointsoffer.controller'
import validateData from '../../middleware/validateRequest'
import { createPointsOfferSchema } from './PointsOffer.validation'

const router = Router()

router.get(
  '/all-points-offer',
  // auth(UserRole.vendor, UserRole.manager, UserRole.cashier),
  PointsOfferController.getAllPointsOffer
)

router.post(
  '/create-points-offer',
  // auth(UserRole.vendor, UserRole.manager),
  validateData(createPointsOfferSchema),
  PointsOfferController.createPointsOffer
)

router.patch(
  '/update-points-offer/:id',
  // auth(UserRole.vendor, UserRole.manager),
  PointsOfferController.updatePointsOffer
)

router.delete(
  '/delete-points-offer/:id',
  // auth(UserRole.vendor, UserRole.manager),
  PointsOfferController.deletePointsOffer
)

export const PointsOfferRoutes = router
