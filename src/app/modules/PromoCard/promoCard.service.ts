import { Request } from 'express'
import { PromoBanner } from './promoCard.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { IPromoBanner } from './promoCard.interface'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'

const createPromoBanner = async (req: Request) => {
  const file = req.file
  const payload = req.body
  payload.bannerImage = file?.path
  const result = await PromoBanner.create(payload)
  return result
}

const getPromoBanner = async (query: Record<string, unknown>) => {
  const updatedQuery = {
    ...query,
    sort: '-status -createdAt',
  }

  const result = await new QueryBuilder(
    PromoBanner.find()
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
    PromoBanner.find(),
    updatedQuery
  ).countTotal()

  return {
    count,
    result,
  }
}

const updatePromoCard = async (
  id: string,
  payload: Partial<IPromoBanner>,
  file?: any
) => {
  if (file) {
    payload.bannerImage = file?.path
  }

  const updatedBanner = await PromoBanner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'PromoCard not found')
  }

  return updatedBanner
}

const deletePormoCard = async (id: string) => {
  const deletedBanner = await PromoBanner.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  )

  if (!deletedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'PromoCard not found')
  }

  return deletedBanner
}

export const PromoBannerService = {
  createPromoBanner,
  getPromoBanner,
  updatePromoCard,
  deletePormoCard,
}
