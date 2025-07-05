import { Router } from 'express'
import { UserController } from './user.controller'
import validateData from '../../middleware/validateRequest'
import { UserValidation } from './user.validation'
import { AdminValidation } from '../Admin/admin.validation'
import auth from '../../middleware/auth'
import { UserRole } from './user.contant'

const router = Router()

router.get(
  '/customers',
  auth(UserRole.admin, UserRole.superAdmin),
  UserController.getAllCustomers
)

router.get(
  '/admin',
  auth(UserRole.admin, UserRole.superAdmin),
  UserController.getAllAdminFromDB
)

router.post(
  '/register',
  validateData(UserValidation.customerSchemaValidation),
  UserController.register
)

router.post(
  '/create-admin',
  auth(UserRole.admin, UserRole.superAdmin),
  // validateData(AdminValidation.adminSchemaValidation),
  UserController.createAdminIntoDB
)

router.post('/create-vendor', UserController.vendorRegister)

router.get(
  '/me',
  auth(UserRole.admin, UserRole.customer, UserRole.vendor),
  UserController.getMeFromDB
)

router.delete('/:id', auth(UserRole.admin), UserController.deleteUser)

export const UserRoutes = router
