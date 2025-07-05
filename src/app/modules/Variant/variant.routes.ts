import express from 'express'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { uploadMultipleImages } from '../../config/cloudinary/multer.config'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { VariantValidation } from './variant.valiadation'
import { VariantController } from './variant.controller'

const router = express.Router()

router.post(
  '/create-variant',
  auth(UserRole.superAdmin, UserRole.admin),
  uploadMultipleImages([{ name: 'variant-Image', maxCount: 10 }]),
  validateRequestedFileData(VariantValidation.CreatedVariantSchema),
  VariantController.createVariant
)

router.get(
  '/',
  // auth(...Object.values(UserRole)),
  VariantController.getAllVariants
)

router.get(
  '/product/:id',
  // auth(...Object.values(UserRole)),
  VariantController.getVariantsByProduct
)

router.get(
  '/:id',
  // auth(...Object.values(UserRole)),
  VariantController.getSingleVariant
)

router.patch(
  '/update/:id',
  auth(UserRole.superAdmin, UserRole.admin),
  uploadMultipleImages([{ name: 'variant-image', maxCount: 10 }]),
  validateRequestedFileData(VariantValidation.updateVariantSchema),
  VariantController.updateVariant
)

router.delete(
  '/delete/:id',
  auth(UserRole.superAdmin, UserRole.admin),
  VariantController.deleteVariant
)

router.patch(
  '/:variantId/stock',
  auth(UserRole.superAdmin, UserRole.admin),
  VariantController.updateVariantStock
)

export const VariantRoutes = router
