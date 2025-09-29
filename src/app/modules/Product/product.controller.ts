import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { ProductService } from './product.service'
import sendResponse from '../../utils/sendResponse'
import { generateEtag } from '../../utils/generateEtag'

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductService.createProductIntoDB(req)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Product created successfully',
    data: result,
  })
})

// const getAllProducts = catchAsync(async (req, res) => {
//   const result = await ProductService.getAllProducts(req.query)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: 'Products retrieved successfully',
//     meta: result?.meta,
//     data: result.result,
//   })
// })

// const getSingleProduct = catchAsync(async (req, res) => {
//   const result = await ProductService.getSingleProduct(req.params.id)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: 'Product retrieved successfully',
//     data: result,
//   })
// })

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProducts(req.query)

  const ETag = generateEtag({ meta: result?.meta, data: result.result })

  if (req.headers['if-none-match'] === ETag) {
    console.log('[match etag]', ETag === req.headers['if-none-match'])
    res.status(httpStatus.NOT_MODIFIED).send() // 304 Not Modified
    return
  }

  res.setHeader('ETag', ETag)

  // console.log('[result]', result)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Products retrieved successfully',
    meta: result?.meta,
    data: result.result,
  })
})

const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getSingleProduct(req.params.id)

  // const etag = generateEtag(result)

  // if (req.headers['if-none-match'] === etag) {
  //   res.status(httpStatus.NOT_MODIFIED).send() // 304 Not Modified
  //   return
  // }

  // res.setHeader('ETag', etag)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product retrieved successfully',
    data: result,
  })
})

const getProductBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params
  const result = await ProductService.getProductBySlug(slug)
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

const getIsFeaturedProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getIsFeaturedProduct()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Featured products retrieved successfully',
    data: result,
  })
})

const getIsTrendingProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getIsTrendingProduct()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Trending products retrieved successfully',
    data: result,
  })
})

const getIsLatestProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getIsLatestProduct()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Latest products retrieved successfully',
    data: result,
  })
})

const getIsBestSellingProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getIsBestSellingProduct()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Best selling products retrieved successfully',
    data: result,
  })
})

const getIsMostViewedProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getIsMostViewedProduct()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Most viewed products retrieved successfully',
    data: result,
  })
})

const getIsFlashSaleProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getIsFlashSaleProduct()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Flash sale products retrieved successfully',
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
  getIsFeaturedProduct,
  getIsTrendingProduct,
  getIsLatestProduct,
  getIsBestSellingProduct,
  getIsMostViewedProduct,
  getIsFlashSaleProduct,
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
  getProductBySlug,
}
