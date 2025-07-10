import { Request } from 'express'
import { Product } from './product.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import mongoose, { Types } from 'mongoose'
import { Category } from '../Category/category.model'
import { Subcategory } from '../Subcategory/subcategory.model'
import { Brand } from '../Brand/brand.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { Variant } from '../Variant/variant.model'
import { Vendor } from '../Vendor/vendor.model'
import { SecondarySubcategory } from '../SecondarySubcategory/SecondarySubcategory.model'
import { generateSku } from './product.utility'

const createProductIntoDB = async (req: Request) => {
  const payload = req.body

  // ✅ Validate Category
  if (payload.category) {
    const categoryExists = await Category.findById(payload.category)
    if (!categoryExists) throw new Error('Category does not exist')
  }

  // ✅ Validate Subcategory
  if (payload.subcategory) {
    const subcategoryExists = await Subcategory.findById(payload.subcategory)
    if (!subcategoryExists) throw new Error('Subcategory does not exist')
  }

  // ✅ Validate Secondary Subcategory
  if (payload.secondarySubcategory) {
    const secondarySubcategoryExists = await SecondarySubcategory.findById(
      payload.secondarySubcategory
    )
    if (!secondarySubcategoryExists)
      throw new Error('Secondary Subcategory does not exist')
  }

  // ✅ Validate Brand
  if (payload.brand) {
    const brandExists = await Brand.findById(payload.brand)
    if (!brandExists) throw new Error('Brand does not exist')
  }

  // ✅ Validate Vendor
  if (payload.vendor) {
    const vendorExists = await Vendor.findOne({
      user: payload.vendor,
      status: 'active',
    })
    if (!vendorExists) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }
  }

  // ✅ Check duplicate product name
  const existingProduct = await Product.findOne({
    productName: payload.productName,
  })
  if (existingProduct) {
    throw new Error('Product already exists')
  }

  // ✅ Generate SKU & Product ID
  payload.sku = await generateSku(payload.category)

  // ✅ Create product
  const result = await Product.create(payload)
  return result
}

//get all product
const getAllProducts = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['productName', 'description']
  const filters: Record<string, any> = { isActive: true }

  // 1️⃣ Handle Variant-Based Filtering (color, size, minPrice, maxPrice)
  const variantQuery: Record<string, any> = {}

  if (query.color) {
    variantQuery.color = { $regex: String(query.color), $options: 'i' }
  }

  if (query.isNewArrival !== undefined) {
    filters.isNewArrival =
      query.isNewArrival === 'true' || query.isNewArrival === true
  }

  if (query.size) {
    const sizeValues = Array.isArray(query.size)
      ? query.size.map(String)
      : [String(query.size)]
    variantQuery.size = { $in: sizeValues }
  }

  if (query.minPrice || query.maxPrice) {
    variantQuery.sellingPrice = {
      ...(query.minPrice ? { $gte: Number(query.minPrice) } : {}),
      ...(query.maxPrice ? { $lte: Number(query.maxPrice) } : {}),
    }
  }

  if (Object.keys(variantQuery).length > 0) {
    const matchingVariants = await Variant.find(variantQuery).select(
      'productId'
    )
    const productIds = [
      ...new Set(matchingVariants.map(v => v.productId.toString())),
    ]
    if (productIds.length === 0) {
      return {
        meta: {
          page: Number(query.page || 1),
          limit: Number(query.limit || 10),
          total: 0,
          totalPage: 0,
        },
        result: [],
      }
    }
    filters._id = { $in: productIds }
  }

  // 2️⃣ Handle Category/Subcategory/Brand Filtering
  const [category, subcategory, brand, secondarySubcategory] =
    await Promise.all([
      query.category
        ? Category.findOne({
            categoryName: { $regex: String(query.category), $options: 'i' },
          }).select('_id')
        : null,
      query.subcategory
        ? Subcategory.findOne({
            subcategoryName: {
              $regex: String(query.subcategory),
              $options: 'i',
            },
          }).select('_id')
        : null,
      query.brand
        ? Brand.findOne({
            brandName: { $regex: String(query.brand), $options: 'i' },
          }).select('_id')
        : null,
      query.secondarySubcategory
        ? SecondarySubcategory.findOne({
            secondarySubcategoryName: {
              $regex: String(query.secondarySubcategory),
              $options: 'i',
            },
          }).select('_id')
        : null,
    ])

  if (category) filters.category = category._id
  if (subcategory) filters.subcategory = subcategory._id
  if (brand) filters.brand = brand._id
  if (secondarySubcategory)
    filters.secondarySubcategory = secondarySubcategory._id

  // 3️⃣ Handle Search Term Across Product and Variant Fields
  if (query.searchTerm && typeof query.searchTerm === 'string') {
    const terms = query.searchTerm.trim().split(/\s+/)
    const searchConditions: any[] = []

    terms.forEach(term => {
      const regex = { $regex: term, $options: 'i' }
      searchAbleFields.forEach(field => {
        searchConditions.push({ [field]: regex })
      })
      // Optional: search inside variant features
      searchConditions.push({ 'variants.features': regex })
    })

    filters.$or = searchConditions
  }

  // 4️⃣ Build Final Query
  const productQuery = Product.find(filters)
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('secondarySubcategory')
    .populate('variant')

  const queryBuilder = new QueryBuilder(productQuery, query)
  const result = await queryBuilder.sort().pagination().fields().modelQuery
  const meta = await queryBuilder.countTotal()

  return {
    meta,
    result,
  }
}

//getproductBy vendor
// const getProductByVendor = async (req: Request) => {
//   const user = req.user
//   const query = req.query

//   let filters = { vendor: user._id } // Always filter by vendor ID

//   if (query?.category || query?.subcategory || query?.brand || query?.variant) {
//     const [category, subcategory, brand, variant] = await Promise.all([
//       query?.category
//         ? Category.findOne({
//             categoryName: { $regex: query?.category, $options: 'i' },
//           }).select('_id')
//         : null,
//       query?.subcategory
//         ? Subcategory.findOne({
//             subcategoryName: { $regex: query?.subcategory, $options: 'i' },
//           }).select('_id')
//         : null,
//       query?.brand
//         ? Brand.findOne({
//             brandName: { $regex: query?.brand, $options: 'i' },
//           }).select('_id')
//         : null,
//       query?.variant
//         ? Brand.findOne({
//             variantName: { $regex: query?.brand, $options: 'i' },
//           }).select('_id')
//         : null,
//     ])

//     // Apply filters based on available searchId values
//     filters = {
//       ...filters, // Keep the vendor filter
//       ...(category && { category: category._id }),
//       ...(subcategory && { subcategory: subcategory._id }),
//       ...(brand && { brand: brand._id }),
//       ...(variant && { variant: query?.variant }),
//     }
//   }

//   // Construct search query for searchTerm
//   const searchAbleFields = ['productName', 'description']
//   let searchQuery: Record<string, unknown> = {}

//   if (query?.searchTerm) {
//     searchQuery = {
//       $or: [
//         ...searchAbleFields.map(field => ({
//           [field]: { $regex: query?.searchTerm, $options: 'i' },
//         })),
//         {
//           features: {
//             $elemMatch: {
//               featureName: { $regex: query?.searchTerm, $options: 'i' },
//             },
//           },
//         },
//       ],
//     }
//   }

//   // Search by price range if available
//   if (query?.price && typeof query.price === 'string') {
//     const priceRange = query?.price.split('-')
//     const minPrice = Number(priceRange[0])
//     const maxPrice = Number(priceRange[1])
//     searchQuery = {
//       ...searchQuery,
//       price: { $gte: minPrice, $lte: maxPrice },
//     }
//   }

//   // Combine filters and search query
//   const finalQuery =
//     Object.keys(searchQuery).length > 0
//       ? { $and: [filters, searchQuery] }
//       : filters

//   // Use QueryBuilder for pagination, sorting, and selecting fields
//   const vendorQuery = await new QueryBuilder(
//     Product.find(finalQuery)
//       .populate('brand')
//       .populate('category')
//       .populate('subcategory')
//       .populate('variant'),
//     query
//   )
//     .sort()
//     .pagination()
//     .fields().modelQuery

//   // For meta data / total count
//   const meta = await new QueryBuilder(
//     Product.find(finalQuery),
//     query
//   ).countTotal()

//   return {
//     meta,
//     result: vendorQuery,
//   }
// }

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id)
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('variant')

  // const getAllVertiants = await Variant.find({ productId: result?._id })
  // const resultWithVariants = {
  //   ...result?.toObject(),
  //   variants: getAllVertiants,
  // }

  return result
}

//get last single created product
const getLastProduct = async (req: Request) => {
  const user = req.user
  const result = await Product.findOne({ vendor: user._id })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('variant')
    .sort({
      createdAt: -1,
    })
  return result
}

export const updateProduct = async (req: Request) => {
  const { id: _id } = req.params
  const payload = req.body

  const isExist = await Product.findById(_id)
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist')
  }

  // STEP 1: Variant remove
  if (payload.removeVariantId) {
    await Product.findByIdAndUpdate(_id, {
      $pull: { variant: payload.removeVariantId },
    })

    // Optional: Also delete variant from DB (if needed)
    // await Variant.findByIdAndDelete(payload.removeVariantId)
  }

  // STEP 2: Variant update
  // if (payload.updateVariant && Array.isArray(payload.updateVariant)) {
  //   for (const variant of payload.updateVariant) {
  //     const { id: variantId, ...rest } = variant

  //     if (!variantId) continue

  //     await Variant.findByIdAndUpdate(variantId, rest, { new: true })
  //   }
  // }

  // STEP 3: Filter out null/empty/undefined values for product update

  const filteredPayload = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        key !== 'removeVariantId'
        // && key !== 'updateVariant'
      ) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  // STEP 4: Update the product
  const updatedProduct = await Product.findOneAndUpdate(
    { _id },
    filteredPayload,
    {
      new: true,
    }
  ).populate('variant')

  return updatedProduct
}

const deleteProduct = async (id: string) => {
  const _id = id

  const isExist = await Product.findById(_id)
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist')
  }

  const result = await Product.findByIdAndUpdate(
    _id,
    { isDeleted: true, isActive: false },
    {
      new: true,
    }
  )
  return result
}

const getNewArrivals = async () => {
  const result = await Product.find({
    isDeleted: false,
    isActive: true,
    isNewArrival: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('variant')
    .sort({ createdAt: -1 })
    .limit(10)

  return result
}

const getProductsByCategory = async (categoryId: string) => {
  const result = await Product.find({
    category: categoryId,
    isDeleted: false,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('variant')

  return result
}

const getProductsByBrand = async (brandId: string) => {
  const result = await Product.find({
    brand: brandId,
    isDeleted: false,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('variant')

  return result
}

//total product count for spicific vendor
const getTotalProductCount = async (req: Request) => {
  const user = req.user
  const result = await Product.countDocuments({ vendor: user._id })
  return result
}

const getCategoryRelatedProductsFromDB = async (excludeProductId: string) => {
  const product = await Product.findById(excludeProductId)

  if (!product) {
    throw new Error('product not found')
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: excludeProductId },
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('variant')
  // Find all products with the same category ID, except for the product with this specific ID.

  return relatedProducts
}

export const ProductService = {
  createProductIntoDB,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getNewArrivals,
  getProductsByCategory,
  getProductsByBrand,
  // getProductByVendor,
  getLastProduct,
  getTotalProductCount,
  getCategoryRelatedProductsFromDB,
}
