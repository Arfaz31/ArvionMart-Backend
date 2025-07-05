import { Request } from 'express'
import { Brand } from './brand.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { searchableFields } from '../Category/category.constant'

const createBrand = async (req: Request) => {
  const payload = req.body
  const file = req.file
  payload.brandLogo = file?.path
  const result = await Brand.create(payload)
  return result
}

const getAllBrand = async (query: Record<string, unknown>) => {
  const brandQuery = await new QueryBuilder(
    Brand.find({ isDeleted: false }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery
  const count = await new QueryBuilder(Brand.find(), query).countTotal()
  return {
    count,
    brandQuery,
  }
}

const updateBrand = async (req: Request) => {
  const { id: _id } = req.params
  const payload = req.body

  let file
  if (req.file) {
    file = req.file
    payload.brandLogo = file?.path
  }

  const filteredPayload = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  const result = await Brand.findOneAndUpdate({ _id }, filteredPayload, {
    new: true,
  })

  return result
}

const deleteBrand = async (id: string) => {
  const _id = id
  const result = await Brand.findByIdAndUpdate(
    _id,
    { isDeleted: true, status: 'INACTIVE' },
    {
      new: true,
    }
  )
  return result
}

export const BrandService = {
  createBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
}
