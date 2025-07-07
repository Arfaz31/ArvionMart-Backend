import express from 'express'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { ProductValidation } from './product.validation'
import { ProductController } from './product.controller'
import validateData from '../../middleware/validateRequest'

const router = express.Router()

router.get(
  '/',
  // auth(...Object.values(UserRole)),
  ProductController.getAllProducts
)

router.get(
  '/single/:id',
  // auth(...Object.values(UserRole)),
  ProductController.getSingleProduct
)

router.get(
  '/new-arrivals',
  // auth(...Object.values(UserRole)),
  ProductController.getNewArrivals
)

router.get(
  '/category/:categoryId',
  // auth(...Object.values(UserRole)),
  ProductController.getProductsByCategory
)

router.get(
  '/brand/:brandId',
  // auth(...Object.values(UserRole)),
  ProductController.getProductsByBrand
)

// router.get(
//   '/vendor/product',
//   auth(UserRole.vendor),
//   ProductController.getProductByVendor
// )

router.get(
  '/product-count',
  auth(...Object.values(UserRole)),
  ProductController.getProductsCountByVendor
)

router.get(
  '/last-product',
  auth(...Object.values(UserRole)),
  ProductController.getLastProduct
)

router.post(
  '/create-product',
  // auth(UserRole.admin, UserRole.superAdmin),
  validateData(ProductValidation.productSchemaValidation),
  ProductController.createProduct
)

router.patch(
  '/update/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  // updloadSingleImage('product-Image'),
  validateRequestedFileData(ProductValidation.updateProductSchemaValidation),
  ProductController.updateProductIntoDB
)

router.delete(
  '/delete/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  ProductController.deleteProduct
)

export const ProductRoutes = router
