import { Request } from 'express'
import { Subcategory } from './subcategory.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import { Category } from '../Category/category.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { clearCategoryCache, clearSidebarCache } from '../../redis/clearCache'
import { SecondarySubcategory } from '../SecondarySubcategory/SecondarySubcategory.model'
import { Product } from '../Product/product.model'
import { Banner } from '../Banner/banner.model'
import { PromoCard } from '../PromoCard/promoCard.model'
import { PromotionalBanner } from '../PromotionalBanner/promotionalBanner.model'
import { Story } from '../Story/story.model'
import { SideBanner } from '../SideBanner/sidebanner.model'

const createSubcategory = async (req: Request) => {
  const payload = req.body
  const file = req.file
  payload.imageUrl = file?.path

  const isExist = await Subcategory.findOne({
    subcategoryName: payload.subcategoryName,
  })
  if (isExist) {
    throw new Error('Subcategory already exist')
  }

  const isExistCategory = await Category.findOne({
    _id: payload.category,
  })

  if (!isExistCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category does not exist')
  }

  const result = await Subcategory.create(payload)
  await clearCategoryCache()
  await clearSidebarCache()
  return result
}

const getAllsubcategory = async (query: Record<string, unknown>) => {
  const searchableFields = ['subcategoryName']
  const result = await new QueryBuilder(
    Subcategory.find().populate('category'),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery
  const count = await new QueryBuilder(Subcategory.find(), query).countTotal()
  return {
    count,
    result,
  }
}

const getSubCategoryById = async (id: string) => {
  const result = await Subcategory.findById(id).populate('category')
  return result
}

const getSubCategoryByCategory = async (categoryId: string) => {
  const _id = categoryId
  const result = await Subcategory.find({ category: _id }).populate('category')
  return result
}

const updatesubcategory = async (req: Request) => {
  const { id: _id } = req.params
  const payload = req.body

  const isExist = await Subcategory.findById(_id)
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subcategory does not exist')
  }

  let file
  if (req.file) {
    file = req.file
    payload.imageUrl = file?.path
  }

  const filteredPayload = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  const result = await Subcategory.findOneAndUpdate({ _id }, filteredPayload, {
    new: true,
  })

  await clearCategoryCache()
  await clearSidebarCache()

  return result
}

const deletesubcategory = async (id: string) => {
  const _id = id

  const isExist = await Subcategory.findById(_id)

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subcategory does not exist')
  }

  const secondarySubcategoriesCount = await SecondarySubcategory.countDocuments(
    {
      subcategory: _id,
      isDeleted: false,
    }
  )

  if (secondarySubcategoriesCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete Subcategory. Secondary Subcategories are associated with this Subcategory.'
    )
  }

  // Check for products
  const productsCount = await Product.countDocuments({
    subcategoryId: _id,
    isDeleted: false,
  })
  if (productsCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete subcategory. Products are associated with this subcategory.'
    )
  }

  // Check for banners
  const bannerCount = await Banner.countDocuments({
    subcategoryId: _id,
    isDeleted: false,
  })
  if (bannerCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete subcategory. Banners are associated with this subcategory.'
    )
  }

  // Check for promo cards
  const promoCardCount = await PromoCard.countDocuments({
    subcategoryId: _id,
    isDeleted: false,
  })
  if (promoCardCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete subcategory. Promo cards are associated with this subcategory.'
    )
  }

  // Check for promotional banners
  const promotionalBannerCount = await PromotionalBanner.countDocuments({
    subcategoryId: _id,
    isDeleted: false,
  })
  if (promotionalBannerCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete subcategory. Promotional banners are associated with this subcategory.'
    )
  }
  // Check for side banners
  const sideBannerCount = await SideBanner.countDocuments({
    subcategoryId: _id,
    isDeleted: false,
  })
  if (sideBannerCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete subcategory. Side banners are associated with this subcategory.'
    )
  }

  // Check for stories
  const storyCount = await Story.countDocuments({
    subcategoryId: _id,
    isDeleted: false,
  })
  if (storyCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete subcategory. Stories are associated with this subcategory.'
    )
  }

  const result = await Subcategory.findByIdAndDelete(_id)
  await clearCategoryCache()
  await clearSidebarCache()
  return result
}

const getSubcategoryBySlug = async (slug: string) => {
  const result = await Subcategory.findOne({ slug }).populate('category')
  return result
}

export const SubcategoryService = {
  createSubcategory,
  getAllsubcategory,
  getSubCategoryById,
  getSubCategoryByCategory,
  updatesubcategory,
  deletesubcategory,
  getSubcategoryBySlug,
}
