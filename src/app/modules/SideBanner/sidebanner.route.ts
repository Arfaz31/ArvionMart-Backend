import { Router } from 'express'
// import auth from '../../middleware/auth'
// import { UserRole } from '../User/user.contant'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { SideBannerController } from './sidebanner.controller'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { SideBannerValidation } from './SideBannerValidation'

const router = Router()

router.post(
  '/create-sidebanner',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('sidebanner-image'),
  validateRequestedFileData(SideBannerValidation.SideBannerSchema),
  SideBannerController.createSideBannerIntoDB
)

router.get('/all-sidebanners', SideBannerController.getAllSideBannersFromDB)

router.get('/active-sidebanner', SideBannerController.getActiveSideBannerFromDB)

router.patch(
  '/update-sidebanner/:id',
  updloadSingleImage('sidebanner-image'),
  validateRequestedFileData(SideBannerValidation.updateSideBannerSchema),
  SideBannerController.updateSideBannerIntoDB
)

router.delete(
  '/delete-sidebanner/:id',
  SideBannerController.deleteSideBannerIntoDB
)

export const SideBannerRoutes = router
