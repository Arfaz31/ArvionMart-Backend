import { Router } from 'express'
import { PromoCardController } from './promoCard.controller'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { PromoCardValidation } from './promoCard.validation'

const router = Router()

router.post(
  '/create-promo-card',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('promo-banner'),
  validateRequestedFileData(PromoCardValidation.PromoCardSchema),
  PromoCardController.createPromoBannerIntoDB
)

router.get('/get-all-promo-card', PromoCardController.getAllPromoBannerDB)

router.patch(
  '/update-promo-card/:id',
  updloadSingleImage('promo-banner'),
  validateRequestedFileData(PromoCardValidation.PromoCardSchema),
  PromoCardController.updatePromoBannerIntoDB
)

router.delete(
  '/delete-promo-card/:id',
  PromoCardController.deletePromoBannerFromDB
)

export const PromoBannerRoutes = router
