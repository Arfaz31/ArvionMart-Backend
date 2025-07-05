import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { SubcategoryService } from './subcategory.service'
import sendResponse from '../../utils/sendResponse'

const createSubCategoryIntoDB = catchAsync(async (req, res) => {
  const result = await SubcategoryService.createSubcategory(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Subcategory created successfully',
    data: result,
  })
})

const getAllSubcategory = catchAsync(async (req, res) => {
  const result = await SubcategoryService.getAllsubcategory(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Subcategory get successfully',
    meta: result.count,
    data: result.result,
  })
})

const getSubCategoryByCategoryFormDB = catchAsync(async (req, res) => {
  const result = await SubcategoryService.getSubCategoryByCategory(
    req.params.id
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Subcategory get successfully',
    data: result,
  })
})

const updateSubcategoryIntoDB = catchAsync(async (req, res) => {
  const result = await SubcategoryService.updatesubcategory(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Subcategory updated successfully',
    data: result,
  })
})

//soft delete
const deleteSubcategory = catchAsync(async (req, res) => {
  const result = await SubcategoryService.deletesubcategory(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Subcategory deleted successfully',
    data: result,
  })
})

export const SubcategoryController = {
  createSubCategoryIntoDB,
  getAllSubcategory,
  updateSubcategoryIntoDB,
  getSubCategoryByCategoryFormDB,
  deleteSubcategory,
}
