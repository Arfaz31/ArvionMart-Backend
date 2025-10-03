import { Request } from 'express'
import { Product } from './product.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import { Types } from 'mongoose'
import { Category } from '../Category/category.model'
import { Subcategory } from '../Subcategory/subcategory.model'
import { Brand } from '../Brand/brand.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { Variant } from '../Variant/variant.model'
import { Vendor } from '../Vendor/vendor.model'
import { SecondarySubcategory } from '../SecondarySubcategory/SecondarySubcategory.model'
import { generateSku } from './product.utility'
import { getOrSetCache } from '../../redis/cache'
import { clearProductCache } from '../../redis/clearCache'
import { Banner } from '../Banner/banner.model'
import { PromoCard } from '../PromoCard/promoCard.model'
import { PromotionalBanner } from '../PromotionalBanner/promotionalBanner.model'
import { Story } from '../Story/story.model'
import { BrandOffer } from '../TopBrandsAndOffers/topBrandAndOffers.model'
import { SideBanner } from '../SideBanner/sidebanner.model'

const generate13DigitBarcode = (): number => {
  const random12Digits = Math.floor(Math.random() * 1_000_000_000_000) // max 12 digits
  const barcode = Number('8' + random12Digits.toString().padStart(12, '0'))
  return barcode
}

const createProductIntoDB = async (req: Request) => {
  const payload = req.body
  console.log(payload)

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

  payload.barCodeNumber = generate13DigitBarcode()

  // ✅ Create product
  const result = await Product.create(payload)
  // ✅ Clear product cache
  await clearProductCache()
  return result
}

const getAllProducts = async (query: Record<string, unknown>) => {
  // ১. প্রতিটি ভিন্ন কুয়েরির জন্য একটি ইউনিক ক্যাশ কী তৈরি করা হয়েছে।
  const cacheKey = `products:all:${JSON.stringify(query)}`

  // ২. getOrSetCache ফাংশনটি কল করা হয়েছে।
  // এটি প্রথমে cacheKey দিয়ে ডেটা খুঁজবে। না পেলে ভেতরের ফাংশনটি (callback)  করবে।
  return getOrSetCache(cacheKey, async () => {
    // ---- নিচের সম্পূর্ণ কোডটি শুধুমাত্র CACHE MISS হলেই রান হবে ----

    // console.log('Fetching products from database for query:', query)

    const textSearchAbleFields = ['productName', 'description']
    const numericSearchAbleFields = ['barCodeNumber']
    const filters: Record<string, any> = { isActive: true }

    // 1️⃣ Handle Variant-Based Filtering
    const variantQuery: Record<string, any> = {}
    if (query.color) {
      variantQuery.color = { $regex: String(query.color), $options: 'i' }
    }
    const booleanFlags = [
      'isNewArrival',
      'isFeatured',
      'isTrending',
      'isLatest',
      'isBestSelling',
      'isMostViewed',
      'isFlashSale',
    ]
    booleanFlags.forEach(flag => {
      if (query[flag] !== undefined) {
        filters[flag] = query[flag] === 'true' || query[flag] === true
      }
    })
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
    const idFields = [
      'category',
      'subcategory',
      'brand',
      'secondarySubcategory',
    ]
    idFields.forEach(field => {
      if (query[field] && Types.ObjectId.isValid(String(query[field]))) {
        filters[field] = new Types.ObjectId(String(query[field]))
      }
    })

    // if (query.searchTerm && typeof query.searchTerm === 'string') {
    //   const searchTerm = query.searchTerm.trim()
    //   const searchConditions: any[] = []
    //   if (!isNaN(Number(searchTerm))) {
    //     numericSearchAbleFields.forEach(field => {
    //       searchConditions.push({ [field]: Number(searchTerm) })
    //     })
    //   }
    //   if (searchTerm.length > 0) {
    //     const regex = { $regex: searchTerm, $options: 'i' }
    //     textSearchAbleFields.forEach(field => {
    //       searchConditions.push({ [field]: regex })
    //     })
    //     searchConditions.push({ 'variants.features': regex })
    //   }
    //   if (searchConditions.length > 0) {
    //     filters.$or = searchConditions
    //   }
    // }
    // 3️⃣ Handle Search Term
    if (query.searchTerm && typeof query.searchTerm === 'string') {
      const searchTerm = query.searchTerm.trim()

      // Use $text for efficient text search if the term is not purely numeric
      if (isNaN(Number(searchTerm))) {
        filters.$text = { $search: searchTerm }
      } else {
        // If it's a number, it could be a barcode or part of a name
        filters.$or = [
          { barCodeNumber: Number(searchTerm) },
          { $text: { $search: searchTerm } },
        ]
      }
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
    // ---- CACHE MISS হলে এই পর্যন্ত কোড রান হয়ে ডেটা রিটার্ন করবে এবং ক্যাশে সেভ হবে ----
  })
}

const getSingleProduct = async (id: string) => {
  // ১. প্রোডাক্টের ID দিয়ে একটি সহজ এবং ইউনিক ক্যাশ কী তৈরি করা হয়েছে।
  const cacheKey = `product:${id}`

  // ২. getOrSetCache ফাংশনটি কল করা হয়েছে। ক্যাশে ডেটা থাকলে সাথে সাথে রিটার্ন করবে।
  return getOrSetCache(cacheKey, async () => {
    // ---- নিচের কোডটি শুধুমাত্র CACHE MISS হলেই রান হবে ----
    console.log(`Fetching product from database for ID: ${id}`)

    const result = await Product.findById(id)
      .populate('brand')
      .populate('category')
      .populate('subcategory')
      .populate('variant')

    return result
  })
}

const getProductBySlug = async (slug: string) => {
  const result = await Product.findOne({ slug })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('variant')
  return result
}

const getIsFeaturedProduct = async () => {
  const result = await Product.find({
    isFeatured: true,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('secondarySubcategory')
    .populate('variant')
    .limit(18)

  return result
}

const getNewArrivals = async () => {
  const result = await Product.find({
    isActive: true,
    isNewArrival: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('variant')
    .sort({ createdAt: -1 })
    .limit(18)

  return result
}

const getIsTrendingProduct = async () => {
  const result = await Product.find({
    isTrending: true,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('secondarySubcategory')
    .populate('variant')
    .limit(18)

  return result
}

const getIsLatestProduct = async () => {
  const result = await Product.find({
    isLatest: true,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('secondarySubcategory')
    .populate('variant')
    .limit(10)

  return result
}

const getIsBestSellingProduct = async () => {
  const result = await Product.find({
    isBestSelling: true,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('secondarySubcategory')
    .populate('variant')
    .limit(10)

  return result
}

const getIsMostViewedProduct = async () => {
  const result = await Product.find({
    isMostViewed: true,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('secondarySubcategory')
    .populate('variant')
    .limit(10)

  return result
}

const getIsFlashSaleProduct = async () => {
  const result = await Product.find({
    isFlashSale: true,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('secondarySubcategory')
    .populate('variant')
    .limit(18)

  return result
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

  await clearProductCache(_id)

  return updatedProduct
}

const deleteProduct = async (id: string) => {
  const _id = id

  const isExist = await Product.findById(_id)
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist')
  }

  const variant = await Variant.find({ productId: _id })
  if (variant && variant.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete a product with variants'
    )
  }

  const bannerCount = await Banner.countDocuments({
    productId: _id,
    isDeleted: false,
  })
  if (bannerCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete a product with banners'
    )
  }

  const promoCardCount = await PromoCard.countDocuments({
    productId: _id,
    isDeleted: false,
  })
  if (promoCardCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete a product with Promo Cards'
    )
  }

  const promotionalBannerCount = await PromotionalBanner.countDocuments({
    productId: _id,
    isDeleted: false,
  })
  if (promotionalBannerCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete a product with promotional banners'
    )
  }

  const storyCount = await Story.countDocuments({
    productId: _id,
    isDeleted: false,
  })
  if (storyCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete a product with stories'
    )
  }

  const brandOfferCount = await BrandOffer.countDocuments({
    productId: _id,
    isDeleted: false,
  })
  if (brandOfferCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete a product with brand offers'
    )
  }

  const sideBannerCount = await SideBanner.countDocuments({
    productId: _id,
    isDeleted: false,
  })
  if (sideBannerCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete a product with side banners'
    )
  }

  const result = await Product.findByIdAndUpdate(
    _id,
    { isActive: false },
    {
      new: true,
    }
  )

  await clearProductCache(_id)
  return result
}

const getProductsByCategory = async (categoryId: string) => {
  const result = await Product.find({
    category: categoryId,
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

// const getCategoryRelatedProductsFromDB = async (excludeProductId: string) => {
//   const product = await Product.findById(excludeProductId)

//   if (!product) {
//     throw new Error('product not found')
//   }

//   const relatedProducts = await Product.find({
//     category: product.category,
//     _id: { $ne: excludeProductId },
//   })
//     .populate('brand')
//     .populate('category')
//     .populate('subcategory')
//     .populate('variant')
//   // Find all products with the same category ID, except for the product with this specific ID.

//   return relatedProducts
// }

const getCategoryRelatedProductsFromDB = async (excludeProductId: string) => {
  // ১. যে প্রোডাক্টের উপর ভিত্তি করে রিলেটেড প্রোডাক্ট খোঁজা হচ্ছে,
  // তার ID দিয়ে একটি ইউনিক ক্যাশ কী তৈরি করা হলো।
  const cacheKey = `products:related:${excludeProductId}`

  // ২. getOrSetCache ফাংশন দিয়ে র‍্যাপ করা হলো।
  return getOrSetCache(cacheKey, async () => {
    // ---- শুধুমাত্র CACHE MISS হলেই এই ভেতরের কোড রান হবে ----

    console.log(
      `Fetching related products from DB for product ID: ${excludeProductId}`
    )

    const product = await Product.findById(excludeProductId)

    if (!product) {
      throw new Error('Product not found, cannot find related products.')
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: excludeProductId },
    })
      .limit(20)
      .populate('brand')
      .populate('category')
      .populate('subcategory')
      .populate('variant')

    return relatedProducts
  })
}

export const ProductService = {
  createProductIntoDB,
  getAllProducts,
  getIsFeaturedProduct,
  getIsTrendingProduct,
  getIsLatestProduct,
  getIsBestSellingProduct,
  getIsMostViewedProduct,
  getIsFlashSaleProduct,
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
  getProductBySlug,
}
