import { Request } from 'express'
import { Category } from './category.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { searchableFields } from './category.constant'
import { Product } from '../Product/product.model'
import { Subcategory } from '../Subcategory/subcategory.model'

const createCategory = async (req: Request) => {
  const payload = req.body
  const file = req.file
  payload.imageUrl = file?.path

  const isExist = await Category.findOne({ categoryName: payload.categoryName })
  if (isExist) {
    throw new Error('Category already exist')
  }

  const result = await Category.create(payload)
  return result
}

const getAllCategory = async (query: Record<string, unknown>) => {
  const categories = await new QueryBuilder(
    Category.find({ isDeleted: false }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(Category.find(), query).countTotal()

  // Get counts for each category
  const categoriesWithProduct = await Promise.all(
    categories.map(async category => {
      const product = await Product.find({
        category: category._id,
      })
      const subCategory = await Subcategory.find({ category: category._id })
      return {
        ...category.toObject(),
        subCategory,
        product,
      }
    })
  )

  return {
    count,
    categoriesWithProduct,
  }
}

const updateCategory = async (req: Request) => {
  const { id: _id } = req.params
  const payload = req.body

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

  const result = await Category.findOneAndUpdate({ _id }, filteredPayload, {
    new: true,
  })

  return result
}

const deleteCategory = async (id: string) => {
  const _id = id
  const result = await Category.findByIdAndUpdate(
    _id,
    { isDeleted: true, status: 'INACTIVE' },
    {
      new: true,
    }
  )
  return result
}

export const CategoryService = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
}
