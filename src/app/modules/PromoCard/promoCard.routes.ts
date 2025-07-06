import { Router } from 'express'
import { PromoBannerController } from './promoCard.controller'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { PromoBannerValidation } from './promoCard.validation'

const router = Router()

router.post(
  '/create-promo-card',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('promo-banner'),
  validateRequestedFileData(PromoBannerValidation.PromoBannerSchema),
  PromoBannerController.createPromoBannerIntoDB
)

router.get('/get-all-promo-card', PromoBannerController.getAllPromoBannerDB)

export const PromoBannerRoutes = router
