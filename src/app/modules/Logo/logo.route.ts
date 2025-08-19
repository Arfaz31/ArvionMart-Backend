import { Router } from 'express'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'

import { LogoController } from './logo.controller'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { LogoValidation } from './logo.validation'

const router = Router()

router.post(
  '/create-logo',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('logo-image'),
  validateRequestedFileData(LogoValidation.logoSchemaValidation),
  LogoController.createLogoIntoDB
)

router.get('/all-logo', LogoController.getAllLogosFromDB)

router.patch(
  '/update-logo/:id',
  updloadSingleImage('logo-image'),
  validateRequestedFileData(LogoValidation.updateLogoSchemaValidation),
  LogoController.updateLogoIntoDB
)

router.delete('/delete-logo/:id', LogoController.deleteLogoFromDB)

export const LogoRoutes = router
