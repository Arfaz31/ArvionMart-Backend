import { Request } from 'express'
import { CustomFile } from '../Variant/variant.service'
import { Banner } from './banner.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'

const createBanner = async (req: Request) => {
  const payload = req.body
  const file = req.file

  payload.image = file?.path

  const result = await Banner.create(payload)

  return result
}

const getAllBanner = async (query: Record<string, unknown>) => {
  const bannerQuery = await new QueryBuilder(Banner.find(), query)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(Banner.find(), query).countTotal()

  return {
    count,
    bannerQuery,
  }
}

export const BannerService = {
  createBanner,
  getAllBanner,
}
