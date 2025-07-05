import { Router } from 'express'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { PromotionalBannerValidation } from './promotionalBanner.validation'
import { PromotionalBannerController } from './promotionalBanner.controller'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'

const router = Router()

router.post(
  '/create-promotion-banner',
  auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('promobanner-image'),
  validateRequestedFileData(
    PromotionalBannerValidation.PromotionalBannerSchema
  ),
  PromotionalBannerController.createPromotionalBannerIntoDB
)

router.get(
  '/all-promotional-banner',
  PromotionalBannerController.getAllPromotionalBanerFromDB
)

export const PromotionalBannerRoutes = router
