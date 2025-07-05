import { Router } from 'express'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { VendorController } from './vendor.controller'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'

const router = Router()

router.get(
  '/all-vendor',
  auth(UserRole.admin, UserRole.superAdmin),
  VendorController.getAllVendors
)

router.get(
  '/vendor-profile',
  auth(UserRole.vendor),
  VendorController.getVendorProfile
)

router.patch(
  '/accept-vendor',
  auth(UserRole.admin, UserRole.superAdmin),
  VendorController.acceptVendor
)

router.patch(
  '/update/profile-image',
  auth(UserRole.vendor),
  updloadSingleImage('profile-image'),
  VendorController.updateVendorProfileImg
)

export const VendorRoutes = router
