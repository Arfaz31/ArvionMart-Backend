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
const getSecondarySubcategoryBySubcategory = async (id: string) => {
  // Find all subcategories under the given category
  const subcategories = await Subcategory.find({ category: id })

  // Map over each subcategory to find its secondary subcategories
  const combinedResult = await Promise.all(
    subcategories.map(async subcategory => {
      const secondarySubcategories = await SecondarySubcategory.find({
        subcategory: subcategory._id,
      })

      return {
        subcategory,
        secondarySubcategories,
      }
    })
  )

  return combinedResult
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
  const result = await SecondarySubcategory.findOneAndDelete(
    { _id: id },
    {
      status: 'INACTIVE',
      isDeleted: true,
    }
  )
  return result
}

export const SecondarySubcategoryService = {
  createSecondarySubcategory,
  getAllSecondarySubcategory,
  updateSecondarySubcategory,
  deleteSecondarySubcategory,
  getSecondarySubcategoryBySubcategory,
  getSecondarySubcategoryBySubcategoryFormDB,
}
