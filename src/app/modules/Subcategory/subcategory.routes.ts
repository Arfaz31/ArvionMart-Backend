import { Router } from 'express'

import { updloadSingleImage } from '../../config/cloudinary/multer.config'

import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { SubcategoryController } from './subcategory.controller'
import { SubcategoryValidation } from './subcategory.validation'

const router = Router()

router.get('/all-subcategory', SubcategoryController.getAllSubcategory)
router.get(
  '/get-subcategory-by-category/:id',
  SubcategoryController.getSubCategoryByCategoryFormDB
)

router.post(
  '/create-subcategory',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('subcategory-Image'),
  validateRequestedFileData(SubcategoryValidation.SubCategoryValidationSchema),
  SubcategoryController.createSubCategoryIntoDB
)

router.patch(
  '/update/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('subcategory-Image'),
  validateRequestedFileData(
    SubcategoryValidation.UpdateSubcategoryValidationSchema
  ),
  SubcategoryController.updateSubcategoryIntoDB
)

router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  SubcategoryController.deleteSubcategory
)

export const SubcategoryRoutes = router
