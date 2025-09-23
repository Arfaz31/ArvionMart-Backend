import { Request } from 'express'
import QueryBuilder from '../../builder/QueryBuilder'
import { PromotionalBanner } from './promotionalBanner.model'
import { AppError } from '../../Error/AppError'
import { IPromotionalBanner } from './promotionalBanner.interface'
import httpStatus from 'http-status'
const createPromotionalBanner = async (req: Request) => {
  const payload = req.body
  const file = req.file

  payload.image = file?.path

  const result = await PromotionalBanner.create(payload)

  return result
}

const getAllPromotionalBanner = async (query: Record<string, unknown>) => {
  const updatedQuery = {
    ...query,
    sort: '-status -createdAt',
  }
  const bannerQuery = await new QueryBuilder(
    PromotionalBanner.find()
      .populate('brandId')
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('secondarySubcategoryId')
      .populate('productId'),
    updatedQuery
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(
    PromotionalBanner.find(),
    updatedQuery
  ).countTotal()

  return {
    count,
    bannerQuery,
  }
}

const getActivePromotionalBanner = async () => {
  const banner = await PromotionalBanner.find({ status: 'ACTIVE' }).limit(5)
  return banner
}

const updatePromotionalBanner = async (
  id: string,
  payload: Partial<IPromotionalBanner>,
  file?: any
) => {
  if (file) {
    payload.image = file?.path
  }

  const updatedBanner = await PromotionalBanner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'PromoBanner not found')
  }

  return updatedBanner
}

const deletePormotionalBanner = async (id: string) => {
  const deletedBanner = await PromotionalBanner.findByIdAndDelete(id)

  if (!deletedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'PromoBanner not found')
  }

  return deletedBanner
}

export const PromotionalBannerService = {
  createPromotionalBanner,
  getAllPromotionalBanner,
  getActivePromotionalBanner,
  updatePromotionalBanner,
  deletePormotionalBanner,
}
