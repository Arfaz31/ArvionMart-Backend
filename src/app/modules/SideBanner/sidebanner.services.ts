import { Request } from 'express'
import QueryBuilder from '../../builder/QueryBuilder'
import { SideBanner } from './sidebanner.model'
import { AppError } from '../../Error/AppError'
import { ISideBanner } from './sidebanner.interface'
import httpStatus from 'http-status'

const createSideBanner = async (req: Request) => {
  const payload = req.body

  const file = req.file

  if (file) {
    payload.image = file.path
  }

  const result = await SideBanner.create(payload)
  return result
}

const getAllSideBanners = async (query: Record<string, unknown>) => {
  const updatedQuery = {
    ...query,
    sort: '-status -order -createdAt',
  }

  const sideBannerQuery = await new QueryBuilder(
    SideBanner.find()
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('secondarySubcategoryId')
      .populate('productId')
      .populate('brandId'),
    updatedQuery
  )
    .search([]) // add fields to search if needed
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(
    SideBanner.find({ isDeleted: false }),
    updatedQuery
  ).countTotal()

  return {
    count,
    sideBannerQuery,
  }
}

const getActiveSideBanner = async () => {
  const banner = await SideBanner.findOne({
    status: 'ACTIVE',
    isDeleted: false,
  })
    .populate('categoryId')
    .populate('subcategoryId')
    .populate('secondarySubcategoryId')
    .populate('productId')
    .populate('brandId')
  return banner
}

const updateSideBanner = async (
  id: string,
  payload: Partial<ISideBanner>,
  file?: Express.Multer.File
) => {
  if (file) {
    payload.image = file.path
  }

  const updatedBanner = await SideBanner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'SideBanner not found')
  }

  return updatedBanner
}

const deleteSideBanner = async (id: string) => {
  // Soft delete: set isDeleted to true, or you can do hard delete with findByIdAndDelete
  const deletedBanner = await SideBanner.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  )

  if (!deletedBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'SideBanner not found')
  }

  return deletedBanner
}

export const SideBannerService = {
  createSideBanner,
  getAllSideBanners,
  getActiveSideBanner,
  updateSideBanner,
  deleteSideBanner,
}
