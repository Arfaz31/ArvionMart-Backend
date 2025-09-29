import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { CategoryService } from './category.service'
import { generateEtag } from '../../utils/generateEtag'

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
  const ETag = generateEtag({ meta: result.meta, data: result.data })

  if (req.headers['if-none-match'] === ETag) {
    res.status(httpStatus.NOT_MODIFIED).send()
    return
  }
  res.setHeader('ETag', ETag)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category get successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getCategoryById = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategoryById(req.params.id)
  // const etag = generateEtag(result)

  // if (req.headers['if-none-match'] === etag) {
  //   res.status(httpStatus.NOT_MODIFIED).send()
  //   return
  // }

  // res.setHeader('ETag', etag)
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

const getSidebarDataforFilterOperation = catchAsync(async (req, res) => {
  const result = await CategoryService.getSidebarDataforFilterOperation(
    req.query
  )
  const ETag = generateEtag(result)

  if (req.headers['if-none-match'] === ETag) {
    res.status(httpStatus.NOT_MODIFIED).send()
    return
  }

  res.setHeader('ETag', ETag)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sidebar filter data fetched successfully',
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
  getSidebarDataforFilterOperation,
}
