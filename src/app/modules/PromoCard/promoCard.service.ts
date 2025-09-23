import { Request } from 'express'
import { PromoCard } from './promoCard.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { IPromoCard } from './promoCard.interface'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'

const createPromoCard = async (req: Request) => {
  const file = req.file
  const payload = req.body
  payload.bannerImage = file?.path
  const result = await PromoCard.create(payload)
  return result
}

const getPromoCard = async (query: Record<string, unknown>) => {
  const updatedQuery = {
    ...query,
    sort: '-status -createdAt',
  }

  const result = await new QueryBuilder(
    PromoCard.find()
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
    PromoCard.find(),
    updatedQuery
  ).countTotal()

  return {
    count,
    result,
  }
}

const getActivePromoCard = async () => {
  const result = await PromoCard.find({ status: 'ACTIVE', isDeleted: false })
    .populate('categoryId')
    .populate('subcategoryId')
    .populate('secondarySubcategoryId')
    .populate('productId')
    .limit(12)

  return result
}

const updatePromoCard = async (
  id: string,
  payload: Partial<IPromoCard>,
  file?: any
) => {
  if (file) {
    payload.bannerImage = file?.path
  }

  const updatedBanner = await PromoCard.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'PromoCard not found')
  }

  return updatedBanner
}

const deletePormoCard = async (id: string) => {
  const deletedBanner = await PromoCard.findByIdAndDelete(id)

  if (!deletedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'PromoCard not found')
  }

  return deletedBanner
}

export const PromoCardService = {
  createPromoCard,
  getPromoCard,
  getActivePromoCard,
  updatePromoCard,
  deletePormoCard,
}
