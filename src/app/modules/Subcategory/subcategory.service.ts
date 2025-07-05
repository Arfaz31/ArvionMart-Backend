import { Request } from 'express'
import { Subcategory } from './subcategory.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import { Category } from '../Category/category.model'
import QueryBuilder from '../../builder/QueryBuilder'

const createSubcategory = async (req: Request) => {
  const payload = req.body
  const file = req.file
  payload.imageUrl = file?.path

  const isExist = await Subcategory.findOne({
    subcategoryName: payload.subcategoryName,
  })
  if (isExist) {
    throw new Error('Subcategory already exist')
  }

  const isExistCategory = await Category.findOne({
    _id: payload.category,
  })

  if (!isExistCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category does not exist')
  }

  const result = await Subcategory.create(payload)
  return result
}

const getAllsubcategory = async (query: Record<string, unknown>) => {
  const searchableFields = ['subcategoryName']
  const result = await new QueryBuilder(
    Subcategory.find().populate('category'),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery
  const count = await new QueryBuilder(Subcategory.find(), query).countTotal()
  return {
    count,
    result,
  }
}

const getSubCategoryByCategory = async (categoryId: string) => {
  const _id = categoryId
  const result = await Subcategory.find({ category: _id }).populate('category')
  return result
}

const updatesubcategory = async (req: Request) => {
  const { id: _id } = req.params
  const payload = req.body

  const isExist = await Subcategory.findById(_id)
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subcategory does not exist')
  }

  let file
  if (req.file) {
    file = req.file
    payload.imageUrl = file?.path
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

  const result = await Subcategory.findOneAndUpdate({ _id }, filteredPayload, {
    new: true,
  })

  return result
}

const deletesubcategory = async (id: string) => {
  const _id = id

  const isExist = await Subcategory.findById(_id)

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subcategory does not exist')
  }

  const result = await Subcategory.findByIdAndUpdate(
    _id,
    { isDeleted: true, status: 'INACTIVE' },
    {
      new: true,
    }
  )
  return result
}

export const SubcategoryService = {
  createSubcategory,
  getAllsubcategory,
  getSubCategoryByCategory,
  updatesubcategory,
  deletesubcategory,
}
