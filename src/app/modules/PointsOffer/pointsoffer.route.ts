import { Router } from 'express'
import { PointsOfferController } from './pointsoffer.controller'

const router = Router()

router.get(
  '/all-points-offer',
  // auth(UserRole.vendor, UserRole.manager, UserRole.cashier),
  PointsOfferController.getAllPointsOffer
)

router.post(
  '/create-points-offer',
  // auth(UserRole.vendor, UserRole.manager),
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
