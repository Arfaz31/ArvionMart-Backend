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
  updateBrandIntoDB,
  deleteBrand,
}
