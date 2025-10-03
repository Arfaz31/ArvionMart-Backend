import QueryBuilder from '../../builder/QueryBuilder'
import { clearCategoryCache, clearSidebarCache } from '../../redis/clearCache'
import { Banner } from '../Banner/banner.model'
import { Product } from '../Product/product.model'
import { PromoCard } from '../PromoCard/promoCard.model'
import { PromotionalBanner } from '../PromotionalBanner/promotionalBanner.model'
import { SideBanner } from '../SideBanner/sidebanner.model'
import { Story } from '../Story/story.model'
import { Subcategory } from '../Subcategory/subcategory.model'
import { ISecondarySubcategory } from './SecondarySubcategory.interface'
import { SecondarySubcategory } from './SecondarySubcategory.model'

const createSecondarySubcategory = async (payload: ISecondarySubcategory) => {
  const isExistSubcategory = await Subcategory.findOne({
    _id: payload.subcategory,
  })
  if (!isExistSubcategory) {
    throw new Error('Subcategory does not exist')
  }

  const isExist = await SecondarySubcategory.findOne({
    secondarySubcategoryName: payload.secondarySubcategoryName,
  })
  if (isExist) {
    throw new Error('Secondary Subcategory already exist')
  }

  const result = await SecondarySubcategory.create(payload)
  await clearCategoryCache()
  await clearSidebarCache()
  return result
}

const getAllSecondarySubcategory = async (query: Record<string, unknown>) => {
  const searchableFields = ['secondarySubcategoryName']

  const subcategoryQuery = await new QueryBuilder(
    SecondarySubcategory.find().populate({
      path: 'subcategory',
      populate: {
        path: 'category',
      },
    }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(
    SecondarySubcategory.find(),
    query
  ).countTotal()

  return {
    count,
    subcategoryQuery,
  }
}

//get category, sub category, and secondary sub category
const getSecondarySubcategoryByCategoryId = async (id: string) => {
  // Find all subcategories for the given category ID
  const subcategories = await Subcategory.find({ category: id })

  // Get the IDs of those subcategories
  const subcategoryIds = subcategories.map(sub => sub._id)

  // Find all secondary subcategories that belong to those subcategories
  const result = await SecondarySubcategory.find({
    subcategory: { $in: subcategoryIds },
  }).populate({
    path: 'subcategory',
    populate: {
      path: 'category',
    },
  })

  return result
}

const getSecondarySubCategoryById = async (id: string) => {
  const result = await SecondarySubcategory.findById(id).populate({
    path: 'subcategory',
    populate: {
      path: 'category',
    },
  })
  return result
}

//get secondary subcategory by subcategory
const getSecondarySubcategoryBySubcategoryFormDB = async (id: string) => {
  const result = await SecondarySubcategory.find({ subcategory: id })
  return result
}

const updateSecondarySubcategory = async (id: string, payload: any) => {
  const isExist = await SecondarySubcategory.findById(id)
  if (!isExist) {
    throw new Error('Secondary Subcategory does not exist')
  }
  const result = await SecondarySubcategory.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  )
  await clearCategoryCache()
  await clearSidebarCache()
  return result
}

const deleteSecondarySubcategory = async (id: string) => {
  const isExist = await SecondarySubcategory.findById(id)
  if (!isExist) {
    throw new Error('Secondary Subcategory does not exist')
  }

  // Check for products
  const productsCount = await Product.countDocuments({
    secondarySubcategoryId: id,
    isDeleted: false,
  })
  if (productsCount > 0) {
    throw new Error(
      'Cannot delete secondary subcategory. Products are associated with this secondary subcategory.'
    )
  }

  // Check for banners
  const bannerCount = await Banner.countDocuments({
    secondarySubcategoryId: id,
    isDeleted: false,
  })
  if (bannerCount > 0) {
    throw new Error(
      'Cannot delete secondary subcategory. Banners are associated with this secondary subcategory.'
    )
  }

  // Check for promo cards
  const promoCardCount = await PromoCard.countDocuments({
    secondarySubcategoryId: id,
    isDeleted: false,
  })
  if (promoCardCount > 0) {
    throw new Error(
      'Cannot delete secondary subcategory. Promo cards are associated with this secondary subcategory.'
    )
  }

  // Check for promotional banners
  const promotionalBannerCount = await PromotionalBanner.countDocuments({
    secondarySubcategoryId: id,
    isDeleted: false,
  })
  if (promotionalBannerCount > 0) {
    throw new Error(
      'Cannot delete secondary subcategory. Promotional banners are associated with this secondary subcategory.'
    )
  }

  // Check for side banners
  const sideBannerCount = await SideBanner.countDocuments({
    secondarySubcategoryId: id,
    isDeleted: false,
  })
  if (sideBannerCount > 0) {
    throw new Error(
      'Cannot delete secondary subcategory. Side banners are associated with this secondary subcategory.'
    )
  }

  // Check for stories
  const storyCount = await Story.countDocuments({
    secondarySubcategoryId: id,
    isDeleted: false,
  })
  if (storyCount > 0) {
    throw new Error(
      'Cannot delete secondary subcategory. Stories are associated with this secondary subcategory.'
    )
  }

  const result = await SecondarySubcategory.findByIdAndDelete(id)
  await clearCategoryCache()
  await clearSidebarCache()
  return result
}

const getSecondarySubcategoryBySlug = async (slug: string) => {
  const result = await SecondarySubcategory.findOne({ slug }).populate({
    path: 'subcategory',
    populate: {
      path: 'category',
    },
  })
  return result
}

export const SecondarySubcategoryService = {
  createSecondarySubcategory,
  getAllSecondarySubcategory,
  getSecondarySubCategoryById,
  updateSecondarySubcategory,
  deleteSecondarySubcategory,
  getSecondarySubcategoryBySubcategoryFormDB,
  getSecondarySubcategoryByCategoryId,
  getSecondarySubcategoryBySlug,
}
