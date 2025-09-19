import { Router } from 'express'
import { BlogController } from './blog.controller'
import { BlogValidation } from './blog.validation'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
// import auth from '../../middleware/auth'
// import { UserRole } from '../User/user.contant'

const router = Router()

router.post(
  '/create-blog',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('blog-image'),
  validateRequestedFileData(BlogValidation.blogSchemaValidation),
  BlogController.createBlogIntoDB
)

router.get('/all-blog', BlogController.getAllBlogFromDB)

router.get('/:id', BlogController.getSingleBlogFromDB)

router.patch(
  '/update-blog/:id',
  updloadSingleImage('blog-image'),
  validateRequestedFileData(BlogValidation.updateBlogSchemaValidation),
  BlogController.updateBlogIntoDB
)

router.delete('/delete-blog/:id', BlogController.deleteBlogFromDB)

export const BlogRoutes = router
