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
    Brand.find({ isDeleted: false }).populate('category'),
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

const getActiveBrand = async (query: Record<string, unknown>) => {
  const brandQuery = await new QueryBuilder(
    Brand.find({ isDeleted: false, status: 'ACTIVE' }).populate('category'),
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

const getBrandById = async (id: string) => {
  const result = await Brand.findById(id).populate('category')
  return result
}

const getBrandByCategoryId = async (categoryId: string) => {
  const result = await Brand.find({ category: categoryId }).populate('category')
  return result
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

// const deleteBrand = async (id: string) => {
//   const _id = id
//   const result = await Brand.findByIdAndUpdate(
//     _id,
//     { isDeleted: true, status: 'INACTIVE' },
//     {
//       new: true,
//     }
//   )
//   return result
// }

const deleteBrand = async (id: string) => {
  const _id = id
  const result = await Brand.findByIdAndDelete(_id)
  return result
}

const getBrandBySlug = async (slug: string) => {
  const result = await Brand.findOne({ slug }).populate('category')
  return result
}

export const BrandService = {
  createBrand,
  getAllBrand,
  getActiveBrand,
  getBrandById,
  getBrandByCategoryId,
  updateBrand,
  deleteBrand,
  getBrandBySlug,
}
