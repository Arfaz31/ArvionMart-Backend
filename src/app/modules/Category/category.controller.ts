import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { CategoryService } from './category.service'

const createCategoryIntoDB = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result,
  })
})

const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategory(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category get successfully',
    meta: result.count,
    data: result.categoriesWithProduct,
  })
})

const getCategoryById = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategoryById(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category get successfully',
    data: result,
  })
})

const updateCategoryIntoDB = catchAsync(async (req, res) => {
  const result = await CategoryService.updateCategory(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category updated successfully',
    data: result,
  })
})

//soft delete
const deleteCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.deleteCategory(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category deleted successfully',
    data: result,
  })
})

const getCategoryBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params
  const result = await CategoryService.getCategoryBySlug(slug)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category get successfully',
    data: result,
  })
})

export const CategoryController = {
  createCategoryIntoDB,
  getAllCategory,
  getCategoryById,
  updateCategoryIntoDB,
  deleteCategory,
  getCategoryBySlug,
}
