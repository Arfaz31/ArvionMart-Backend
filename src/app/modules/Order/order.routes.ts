import { Router } from 'express'
import { OrderController } from './order.controller'
import auth from '../../middleware/auth'
import { UserRole } from '../User/user.contant'
import { CreateOrderValidationSchema } from './order.validation'
import validateData from '../../middleware/validateRequest'

const router = Router()
router.get(
  '/reports',
  auth(UserRole.admin, UserRole.superAdmin),
  OrderController.getReports
)

router.get(
  '/',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.vendor),
  OrderController.getOrderFromBD
)

router.get(
  '/my-orders',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.customer),
  OrderController.getMyOrders
)

router.get(
  '/my-orders/:id',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.customer),
  OrderController.getSingleOrder
)

router.post(
  '/create-order',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.customer),
  validateData(CreateOrderValidationSchema),
  OrderController.createOrderIntoDB
)

router.patch(
  '/update-deliver-status/:id',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.vendor),
  OrderController.updateOrderDeliverStatus
)
router.patch(
  '/cancel-request/:orderId',
  auth(UserRole.customer),
  OrderController.requestCancelOrder
)

// ✅ Admin/SuperAdmin reviews cancel request
router.patch(
  '/cancel-review/:orderId',
  auth(UserRole.superAdmin, UserRole.admin),
  OrderController.reviewCancelRequest
)

export const OrderRouters = router
