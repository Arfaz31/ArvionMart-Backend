import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { SecondarySubcategoryService } from './SecondarySubcategory.service'
import httpStatus from 'http-status'

const createSecondarySubcategory = catchAsync(async (req, res) => {
  const result = await SecondarySubcategoryService.createSecondarySubcategory(
    req.body
  )
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Secondary Subcategory created successfully',
    data: result,
  })
})

const getAllSecondarySubcategory = catchAsync(async (req, res) => {
  const result = await SecondarySubcategoryService.getAllSecondarySubcategory(
    req.query
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Secondary Subcategory get successfully',
    meta: result.count,
    data: result.subcategoryQuery,
  })
})

const getSecondarySubcategoryBySubcategory = catchAsync(async (req, res) => {
  const result =
    await SecondarySubcategoryService.getSecondarySubcategoryBySubcategory(
      req.params.id
    )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Secondary Subcategory by subcategory get successfully',
    data: result,
  })
})

const getSecondarySubcategoryByIdFromDB = catchAsync(async (req, res) => {
  const result =
    await SecondarySubcategoryService.getSecondarySubcategoryBySubcategoryFormDB(
      req.params.id
    )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Secondary Subcategory by id get successfully',
    data: result,
  })
})

const updateSecondarySubcategory = catchAsync(async (req, res) => {
  const result = await SecondarySubcategoryService.updateSecondarySubcategory(
    req.params.id,
    req.body
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Secondary Subcategory updated successfully',
    data: result,
  })
})

const deleteSecondarySubcategory = catchAsync(async (req, res) => {
  const result = await SecondarySubcategoryService.deleteSecondarySubcategory(
    req.params.id
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Secondary Subcategory deleted successfully',
    data: result,
  })
})

export const SecondarySubcategoryController = {
  createSecondarySubcategory,
  getAllSecondarySubcategory,
  updateSecondarySubcategory,
  deleteSecondarySubcategory,
  getSecondarySubcategoryBySubcategory,
  getSecondarySubcategoryByIdFromDB,
}
