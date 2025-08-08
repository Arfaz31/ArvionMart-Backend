import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'

import httpStatus from 'http-status'
import { StoryService } from './story.services'

const createStoryIntoDB = catchAsync(async (req, res) => {
  const result = await StoryService.createStory(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Story created successfully',
    data: result,
  })
})

const getAllStoryFromDB = catchAsync(async (req, res) => {
  const result = await StoryService.getAllStory(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Story get successfully',
    meta: result.count,
    data: result.StoryQuery,
  })
})

const updateStoryIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const payload = req.body
  const file = req.file

  const result = await StoryService.updateStory(id, payload, file)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Story updated successfully',
    data: result,
  })
})

const getActiveStory = catchAsync(async (req, res) => {
  const result = await StoryService.getActiveStory()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Story get successfully',
    data: result,
  })
})

const deleteStoryFromDB = catchAsync(async (req, res) => {
  const id = req.params.id

  const result = await StoryService.deleteStory(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Story deleted successfully',
    data: result,
  })
})

export const StoryController = {
  createStoryIntoDB,
  getAllStoryFromDB,
  updateStoryIntoDB,
  getActiveStory,
  deleteStoryFromDB,
}
