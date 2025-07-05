import { NextFunction, Request, Response, Router } from 'express'
import { CategoryController } from './category.controller'
import {
  updloadSingleImage,
  uploadMultipleImages,
} from '../../config/cloudinary/multer.config'
import { CategoryValidation } from './category.validation'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'

const router = Router()

router.get('/all-category', CategoryController.getAllCategory)

router.post(
  '/create-category',
  auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('category-Image'),
  validateRequestedFileData(CategoryValidation.CategoryValidationSchema),
  CategoryController.createCategoryIntoDB
)

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('category-Image'),
  validateRequestedFileData(CategoryValidation.UpdateCategoryValidationSchema),
  CategoryController.updateCategoryIntoDB
)

router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  CategoryController.deleteCategory
)

export const CategoryRoutes = router
