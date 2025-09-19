import QueryBuilder from '../../builder/QueryBuilder'
import { Subcategory } from '../Subcategory/subcategory.model'
import { ISecondarySubcategory } from './SecondarySubcategory.interface'
import { SecondarySubcategory } from './SecondarySubcategory.model'

const createSecondarySubcategory = async (payload: ISecondarySubcategory) => {
  const isExistSubcategory = await Subcategory.findOne({
    _id: payload.subcategory,
  })
  if (!isExistSubcategory) {
    throw new Error('Subcategory does not exist')
  }

  const isExist = await SecondarySubcategory.findOne({
    secondarySubcategoryName: payload.secondarySubcategoryName,
  })
  if (isExist) {
    throw new Error('Secondary Subcategory already exist')
  }

  const result = await SecondarySubcategory.create(payload)
  return result
}

const getAllSecondarySubcategory = async (query: Record<string, unknown>) => {
  const searchableFields = ['secondarySubcategoryName']

  const subcategoryQuery = await new QueryBuilder(
    SecondarySubcategory.find().populate({
      path: 'subcategory',
      populate: {
        path: 'category',
      },
    }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(
    SecondarySubcategory.find(),
    query
  ).countTotal()

  return {
    count,
    subcategoryQuery,
  }
}

//get category, sub category, and secondary sub category
const getSecondarySubcategoryByCategoryId = async (id: string) => {
  // Find all subcategories for the given category ID
  const subcategories = await Subcategory.find({ category: id })

  // Get the IDs of those subcategories
  const subcategoryIds = subcategories.map(sub => sub._id)

  // Find all secondary subcategories that belong to those subcategories
  const result = await SecondarySubcategory.find({
    subcategory: { $in: subcategoryIds },
  }).populate({
    path: 'subcategory',
    populate: {
      path: 'category',
    },
  })

  return result
}

const getSecondarySubCategoryById = async (id: string) => {
  const result = await SecondarySubcategory.findById(id).populate({
    path: 'subcategory',
    populate: {
      path: 'category',
    },
  })
  return result
}

//get secondary subcategory by subcategory
const getSecondarySubcategoryBySubcategoryFormDB = async (id: string) => {
  const result = await SecondarySubcategory.find({ subcategory: id })
  return result
}

const updateSecondarySubcategory = async (id: string, payload: any) => {
  const isExist = await SecondarySubcategory.findById(id)
  if (!isExist) {
    throw new Error('Secondary Subcategory does not exist')
  }
  const result = await SecondarySubcategory.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  )
  return result
}

const deleteSecondarySubcategory = async (id: string) => {
  const isExist = await SecondarySubcategory.findById(id)
  if (!isExist) {
    throw new Error('Secondary Subcategory does not exist')
  }
  const result = await SecondarySubcategory.findByIdAndDelete(id)
  return result
}

const getSecondarySubcategoryBySlug = async (slug: string) => {
  const result = await SecondarySubcategory.findOne({ slug }).populate({
    path: 'subcategory',
    populate: {
      path: 'category',
    },
  })
  return result
}

export const SecondarySubcategoryService = {
  createSecondarySubcategory,
  getAllSecondarySubcategory,
  getSecondarySubCategoryById,
  updateSecondarySubcategory,
  deleteSecondarySubcategory,
  getSecondarySubcategoryBySubcategoryFormDB,
  getSecondarySubcategoryByCategoryId,
  getSecondarySubcategoryBySlug,
}
