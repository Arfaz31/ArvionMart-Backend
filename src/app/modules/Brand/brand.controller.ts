import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { BrandService } from './brand.service'

const createBrandIntoDB = catchAsync(async (req, res) => {
  const result = await BrandService.createBrand(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Brand created successfully',
    data: result,
  })
})

const getAllBrand = catchAsync(async (req, res) => {
  const result = await BrandService.getAllBrand(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Brand get successfully',
    meta: result.count,
    data: result.brandQuery,
  })
})

const getActiveBrand = catchAsync(async (req, res) => {
  const result = await BrandService.getActiveBrand()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Brand get successfully',
    data: result,
  })
})

const getBrandById = catchAsync(async (req, res) => {
  const result = await BrandService.getBrandById(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Brand get successfully',
    data: result,
  })
})

const getBrandByCategoryId = catchAsync(async (req, res) => {
  const result = await BrandService.getBrandByCategoryId(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Brand get successfully',
    data: result,
  })
})

const updateBrandIntoDB = catchAsync(async (req, res) => {
  const result = await BrandService.updateBrand(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category updated successfully',
    data: result,
  })
})

//soft delete
const deleteBrand = catchAsync(async (req, res) => {
  const result = await BrandService.deleteBrand(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Brand deleted successfully',
    data: result,
  })
})

export const BrandController = {
  createBrandIntoDB,
  getAllBrand,
  getBrandById,
  getBrandByCategoryId,
  getActiveBrand,
  updateBrandIntoDB,
  deleteBrand,
}
