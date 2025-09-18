import express from 'express'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'
import { ProductValidation } from './product.validation'
import { ProductController } from './product.controller'
import validateData from '../../middleware/validateRequest'

const router = express.Router()

router.post(
  '/create-product',
  // auth(UserRole.admin, UserRole.superAdmin),
  validateData(ProductValidation.productSchemaValidation),
  ProductController.createProduct
)

router.get(
  '/',
  // auth(...Object.values(UserRole)),
  ProductController.getAllProducts
)

router.get('/featured', ProductController.getIsFeaturedProduct)
router.get('/trending', ProductController.getIsTrendingProduct)
router.get('/latest', ProductController.getIsLatestProduct)
router.get('/bestselling', ProductController.getIsBestSellingProduct)
router.get('/mostviewed', ProductController.getIsMostViewedProduct)
router.get('/flashsale', ProductController.getIsFlashSaleProduct)

router.get(
  '/new-arrivals',
  // auth(...Object.values(UserRole)),
  ProductController.getNewArrivals
)

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

router.get(
  '/single/:id',
  // auth(...Object.values(UserRole)),
  ProductController.getSingleProduct
)

router.get(
  '/slug/:slug',
  // auth(...Object.values(UserRole)),
  ProductController.getProductBySlug
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

router.get(
  '/:id/related',
  // auth(...Object.values(UserRole)),
  ProductController.getCategoryRelatedProducts
)

router.patch(
  '/update/:id',
  // auth(UserRole.admin, UserRole.superAdmin),

  validateRequestedFileData(ProductValidation.updateProductSchemaValidation),
  ProductController.updateProductIntoDB
)

router.delete(
  '/delete/:id',
  // auth(UserRole.admin, UserRole.superAdmin),
  ProductController.deleteProduct
)

export const ProductRoutes = router
