import { Router } from 'express'
import { SecondarySubcategoryController } from './SecondarySubcategory.controller'
import { UserRole } from '../User/user.contant'
import auth from '../../middleware/auth'
import validateData from '../../middleware/validateRequest'
import { SecondarySubcategoryValidation } from './SecondarySubcategory.validation'

const router = Router()

router.get(
  '/get-all',
  SecondarySubcategoryController.getAllSecondarySubcategory
)

router.get(
  '/single-subcategory/:id',
  SecondarySubcategoryController.getSecondarySubcategoryByIdFromDB
)

router.get(
  '/subcategory/:id',
  SecondarySubcategoryController.getSecondarySubcategoryBySubcategory
)

router.post(
  '/create',
  // auth(UserRole.admin, UserRole.superAdmin),
  validateData(
    SecondarySubcategoryValidation.SecondarySubcategorySchemaValidation
  ),
  SecondarySubcategoryController.createSecondarySubcategory
)

router.patch(
  '/update/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  validateData(
    SecondarySubcategoryValidation.updateSecondarySubcategorySchemaValidation
  ),
  SecondarySubcategoryController.updateSecondarySubcategory
)

router.delete(
  '/delete/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  SecondarySubcategoryController.deleteSecondarySubcategory
)

export const SecondarySubcategoryRoutes = router
