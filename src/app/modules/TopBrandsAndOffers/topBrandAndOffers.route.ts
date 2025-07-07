import { Router } from 'express'

import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { BrandOfferValidation } from './topBrandOffer.validation'
import { BrandOfferController } from './topBrandAndOffers.controller'

const router = Router()

router.post(
  '/',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('brandoffer-image'),
  validateRequestedFileData(
    BrandOfferValidation.createBrandOfferValidationSchema
  ),
  BrandOfferController.createBrandOffer
)

router.get('/', BrandOfferController.getAllBrandOffers)
router.get('/top-brands', BrandOfferController.getTopBrandOffers)

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('brandoffer-image'),
  validateRequestedFileData(
    BrandOfferValidation.updateBrandOfferValidationSchema
  ),
  BrandOfferController.updateBrandOffer
)

router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  BrandOfferController.deleteBrandOffer
)

export const BrandOfferRoutes = router
