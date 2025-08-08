import { Request } from 'express'
import { CustomFile } from '../Variant/variant.service'

import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import { Story } from './story.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { IStory } from './story.interface'

const createStory = async (req: Request) => {
  const payload = req.body
  const file = req.file

  payload.image = file?.path

  const result = await Story.create(payload)

  return result
}

const getAllStory = async (query: Record<string, unknown>) => {
  // Set default sort by status (ACTIVE first), fallback to createdAt
  const updatedQuery = {
    ...query,
    sort: '-status order',
  }

  const StoryQuery = await new QueryBuilder(
    Story.find()
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('secondarySubcategoryId')
      .populate('productId')
      .populate('brnadId'),
    updatedQuery
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(Story.find(), updatedQuery).countTotal()

  return {
    count,
    StoryQuery,
  }
}

const getActiveStory = async () => {
  const result = await Story.find({ status: 'ACTIVE' })
  return result
}

const updateStory = async (
  id: string,
  payload: Partial<IStory>,
  file?: CustomFile
) => {
  if (file) {
    payload.image = file?.path
  }

  const updatedStory = await Story.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedStory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Story not found')
  }

  return updatedStory
}

const deleteStory = async (id: string) => {
  const deletedStory = await Story.findByIdAndDelete(id)

  if (!deletedStory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Story not found')
  }

  return deletedStory
}

export const StoryService = {
  createStory,
  getAllStory,
  updateStory,
  getActiveStory,
  deleteStory,
}
