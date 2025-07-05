import { Request } from 'express'
import QueryBuilder from '../../builder/QueryBuilder'
import { PromotionalBanner } from './promotionalBanner.model'

const createPromotionalBanner = async (req: Request) => {
  const payload = req.body
  const file = req.file

  payload.image = file?.path

  const result = await PromotionalBanner.create(payload)

  return result
}

const getAllPromotionalBanner = async (query: Record<string, unknown>) => {
  const bannerQuery = await new QueryBuilder(PromotionalBanner.find(), query)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(
    PromotionalBanner.find(),
    query
  ).countTotal()

  return {
    count,
    bannerQuery,
  }
}

export const PromotionalBannerService = {
  createPromotionalBanner,
  getAllPromotionalBanner,
}
