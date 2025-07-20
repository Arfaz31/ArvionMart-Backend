import { Request } from 'express'
import { CustomFile } from '../Variant/variant.service'
import { Banner } from './banner.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import { IBanner } from './banner.interface'

const createBanner = async (req: Request) => {
  const payload = req.body
  const file = req.file

  payload.image = file?.path

  const result = await Banner.create(payload)

  return result
}

const getAllBanner = async (query: Record<string, unknown>) => {
  // Set default sort by status (ACTIVE first), fallback to createdAt
  const updatedQuery = {
    ...query,
    sort: '-status -createdAt',
  }

  const bannerQuery = await new QueryBuilder(
    Banner.find()
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

  const count = await new QueryBuilder(Banner.find(), updatedQuery).countTotal()

  return {
    count,
    bannerQuery,
  }
}

const updateBanner = async (
  id: string,
  payload: Partial<IBanner>,
  file?: CustomFile
) => {
  if (file) {
    payload.image = file?.path
  }

  const updatedBanner = await Banner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'Banner not found')
  }

  return updatedBanner
}

const deleteBanner = async (id: string) => {
  const deletedBanner = await Banner.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  )

  if (!deletedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'Banner not found')
  }

  return deletedBanner
}

export const BannerService = {
  createBanner,
  getAllBanner,
  updateBanner,
  deleteBanner,
}
