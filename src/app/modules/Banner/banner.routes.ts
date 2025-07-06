import { Router } from 'express'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { BannerValidation } from './banner.validation'
import { BannerController } from './banner.controller'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'

const router = Router()

router.post(
  '/create-banner',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('banner-image'),
  validateRequestedFileData(BannerValidation.bannerSchemaValidation),
  BannerController.createBannerIntoDB
)

router.get('/all-banner', BannerController.getAllBanerFromDB)

export const BannerRoutes = router
