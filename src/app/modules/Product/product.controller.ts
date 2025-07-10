import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { ProductService } from './product.service'
import sendResponse from '../../utils/sendResponse'

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductService.createProductIntoDB(req)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Product created successfully',
    data: result,
  })
})

// const getProductByVendor = catchAsync(async (req, res) => {
//   const result = await ProductService.getProductByVendor(req)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: 'Vendor Product retrieved successfully',
//     meta: result?.meta,
//     data: result?.result,
//   })
// })

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProducts(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Products retrieved successfully',
    meta: result?.meta,
    data: result.result,
  })
})

const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getSingleProduct(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product retrieved successfully',
    data: result,
  })
})

const getLastProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getLastProduct(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Last Product retrieved successfully',
    data: result,
  })
})

const updateProductIntoDB = catchAsync(async (req, res) => {
  const result = await ProductService.updateProduct(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product updated successfully',
    data: result,
  })
})

// soft delete
const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductService.deleteProduct(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product deleted successfully',
    data: result,
  })
})

const getNewArrivals = catchAsync(async (req, res) => {
  const result = await ProductService.getNewArrivals()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'New arrival products retrieved successfully',
    data: result,
  })
})

const getProductsByCategory = catchAsync(async (req, res) => {
  const result = await ProductService.getProductsByCategory(
    req.params.categoryId
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Products by category retrieved successfully',
    data: result,
  })
})

const getProductsByBrand = catchAsync(async (req, res) => {
  const result = await ProductService.getProductsByBrand(req.params.brandId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Products by brand retrieved successfully',
    data: result,
  })
})

const getProductsCountByVendor = catchAsync(async (req, res) => {
  const result = await ProductService.getTotalProductCount(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Total product count retrieved successfully',
    data: result,
  })
})

const getCategoryRelatedProducts = catchAsync(async (req, res) => {
  const { id } = req.params

  const relatedProducts = await ProductService.getCategoryRelatedProductsFromDB(
    id
  )
  // the id (which is the ID of the product itself).

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Related products retrieved successfully',
    data: relatedProducts,
  })
})

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProductIntoDB,
  deleteProduct,
  getNewArrivals,
  getProductsByCategory,
  getProductsByBrand,
  // getProductByVendor,
  getLastProduct,
  getProductsCountByVendor,
  getCategoryRelatedProducts,
}
