import { Router } from 'express'
import { DashboardOverviewController } from './dashboardoverview.controller'

const router = Router()

router.get(
  '/today-order-amount',
  DashboardOverviewController.todayOrderAmountFromDB
)

router.get(
  '/total-order-amount',
  DashboardOverviewController.totalOrderAmountFromDB
)

router.get(
  '/current-monthly-order-amount',
  DashboardOverviewController.monthlyOrderAmountFromDB
)

router.get(
  '/previous-monthly-order-amount',
  DashboardOverviewController.previousMonthOrderAmountFromDB
)

router.get('/total-order', DashboardOverviewController.totalOrderFromDB)

router.get('/fullyearsales', DashboardOverviewController.getFullYearSales)

export const DashboardOverviewRoutes = router
