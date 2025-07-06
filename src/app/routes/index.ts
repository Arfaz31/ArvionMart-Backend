import { Router } from 'express'
import { UserRoutes } from '../modules/User/user.routes'
import { AuthRoutes } from '../modules/Auth/auth.routes'
import { CategoryRoutes } from '../modules/Category/category.routes'
import { SubcategoryRoutes } from '../modules/Subcategory/subcategory.routes'
import { BrandRoutes } from '../modules/Brand/brand.routes'
import { ProductRoutes } from '../modules/Product/product.routes'
import { VariantRoutes } from '../modules/Variant/variant.routes'
import { OrderRouters } from '../modules/Order/order.routes'
import { VendorRoutes } from '../modules/Vendor/vendor.routes'
import { BannerRoutes } from '../modules/Banner/banner.routes'
import { PromotionalBannerRoutes } from '../modules/PromotionalBanner/promotionalBanner.routes'
import { SecondarySubcategoryRoutes } from '../modules/SecondarySubcategory/SecondarySubcategory.routes'
import { PaymentRoutes } from '../modules/Payment/payment.routes'
import { PromoBannerRoutes } from '../modules/PromoCard/promoCard.routes'
import { ReviewRoutes } from '../modules/Review/review.routes'

const middlewareRoutes = Router()

const router = [
  {
    path: '/user',
    routes: UserRoutes,
  },
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/category',
    routes: CategoryRoutes,
  },
  {
    path: '/subcategory',
    routes: SubcategoryRoutes,
  },
  {
    path: '/brand',
    routes: BrandRoutes,
  },
  {
    path: '/product',
    routes: ProductRoutes,
  },
  {
    path: '/variant',
    routes: VariantRoutes,
  },
  {
    path: '/order',
    routes: OrderRouters,
  },
  {
    path: '/review',
    routes: ReviewRoutes,
  },
  {
    path: '/vendor',
    routes: VendorRoutes,
  },
  {
    path: '/banner',
    routes: BannerRoutes,
  },
  {
    path: '/promotional-banner',
    routes: PromotionalBannerRoutes,
  },
  {
    path: '/secondary-subcategory',
    routes: SecondarySubcategoryRoutes,
  },
  {
    path: '/payment',
    routes: PaymentRoutes,
  },
  {
    path: '/promo-card',
    routes: PromoBannerRoutes,
  },
]

router.forEach(route => middlewareRoutes.use(route.path, route.routes))

export default middlewareRoutes
