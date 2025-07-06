import { Router } from 'express'
import { BrandController } from './brand.controller'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { BrandValidation } from './brand.validation'

const router = Router()

router.get(
  '/all-brand',
  // auth(...Object.values(UserRole)),
  BrandController.getAllBrand
)

router.post(
  '/create-brand',
  // auth(UserRole.admin, UserRole.superAdmin, UserRole.vendor),
  updloadSingleImage('brand-Image'),
  validateRequestedFileData(BrandValidation.BrandValidationSchema),
  BrandController.createBrandIntoDB
)

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.vendor),
  updloadSingleImage('brand-Image'),
  validateRequestedFileData(BrandValidation.UpdateBrnadValidationSchema),
  BrandController.updateBrandIntoDB
)

router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.vendor),
  BrandController.deleteBrand
)

export const BrandRoutes = router
