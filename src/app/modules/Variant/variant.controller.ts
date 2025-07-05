import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { VariantService } from './variant.service'
import sendResponse from '../../utils/sendResponse'

const createVariant = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body)

  const result = await VariantService.createVariantIntoDB(req)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Variant created successfully',
    data: result,
  })
})

const getAllVariants = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.getAllVariants(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variants retrieved successfully',
    data: result,
  })
})

const getVariantsByProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params
  const result = await VariantService.getVariantsByProduct(productId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variants retrieved successfully',
    data: result,
  })
})

const getSingleVariant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await VariantService.getSingleVariant(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variant retrieved successfully',
    data: result,
  })
})

const updateVariant = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.updateVariant(req)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variant updated successfully',
    data: result,
  })
})

const deleteVariant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await VariantService.deleteVariant(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variant deleted successfully',
    data: result,
  })
})

const updateVariantStock = catchAsync(async (req: Request, res: Response) => {
  const { variantId } = req.params
  const { quantity } = req.body

  const result = await VariantService.updateVariantQuantity(variantId, quantity)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variant stock updated successfully',
    data: result,
  })
})

export const VariantController = {
  createVariant,
  getAllVariants,
  getVariantsByProduct,
  getSingleVariant,
  updateVariant,
  deleteVariant,
  updateVariantStock,
}
