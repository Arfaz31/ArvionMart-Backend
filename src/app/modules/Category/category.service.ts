import { Request } from 'express'
import { Category } from './category.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { searchableFields } from './category.constant'
import { Product } from '../Product/product.model'
import { Subcategory } from '../Subcategory/subcategory.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import { SecondarySubcategory } from '../SecondarySubcategory/SecondarySubcategory.model'
import { Brand } from '../Brand/brand.model'

const createCategory = async (req: Request) => {
  const payload = req.body
  const file = req.file
  payload.imageUrl = file?.path

  const isExist = await Category.findOne({ categoryName: payload.categoryName })
  if (isExist) {
    throw new Error('Category already exist')
  }

  const result = await Category.create(payload)
  return result
}

const getAllCategory = async (query: Record<string, unknown>) => {
  const categories = await new QueryBuilder(
    Category.find({ isDeleted: false }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(Category.find(), query).countTotal()

  // Get counts for each category
  const categoriesWithProduct = await Promise.all(
    categories.map(async category => {
      const product = await Product.find({
        category: category._id,
      })
      const subCategory = await Subcategory.find({ category: category._id })
      return {
        ...category.toObject(),
        subCategory,
        product,
      }
    })
  )

  return {
    count,
    categoriesWithProduct,
  }
}

const getCategoryById = async (id: string) => {
  const result = await Category.findById(id)
  return result
}

const getCategoryBySlug = async (slug: string) => {
  const result = await Category.findOne({ slug })
  return result
}

const updateCategory = async (req: Request) => {
  const { id: _id } = req.params
  const payload = req.body

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

  const result = await Category.findOneAndUpdate({ _id }, filteredPayload, {
    new: true,
  })

  return result
}

const deleteCategory = async (id: string) => {
  const _id = id
  const result = await Category.findByIdAndDelete(_id)

  return result
}

const getSidebarDataforFilterOperation = async (
  query: Record<string, unknown>
) => {
  let category = null
  let subcategory = null
  let secondarySubcategory = null
  let brand = null
  let subcategories: any[] = []
  let secondarySubcategories: any[] = []
  let brands: any[] = []

  // 🆕 Case 0️⃣: If query.all
  if (query.all) {
    const categories = await Category.find({
      isDeleted: false,
      status: 'ACTIVE',
    })
    const subcategoriesAll = await Subcategory.find({
      isDeleted: false,
      status: 'ACTIVE',
    })
    const secondarySubcategoriesAll = await SecondarySubcategory.find({
      isDeleted: false,
      status: 'ACTIVE',
    })
    const brandsAll = await Brand.find({ isDeleted: false, status: 'ACTIVE' })

    if (
      categories.length === 0 &&
      subcategoriesAll.length === 0 &&
      secondarySubcategoriesAll.length === 0 &&
      brandsAll.length === 0
    ) {
      throw new AppError(httpStatus.NOT_FOUND, 'No sidebar data found')
    }

    return {
      categories,
      subcategories: subcategoriesAll,
      secondarySubcategories: secondarySubcategoriesAll,
      brands: brandsAll,
    }
  }

  // 1️⃣ If categorySlug
  if (query.categorySlug) {
    category = await Category.findOne({
      slug: query.categorySlug,
      isDeleted: false,
      status: 'ACTIVE',
    })
    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, 'Category not found')
    }

    // Get all subcategories for this category
    subcategories = await Subcategory.find({
      category: category._id,
      isDeleted: false,
      status: 'ACTIVE',
    })

    const subcategoryIds = subcategories.map(s => s._id)

    // Get all secondary subcategories for all subcategories of this category
    secondarySubcategories = await SecondarySubcategory.find({
      subcategory: { $in: subcategoryIds },
      isDeleted: false,
      status: 'ACTIVE',
    })

    // Get all brands for this category
    brands = await Brand.find({
      category: category._id,
      isDeleted: false,
      status: 'ACTIVE',
    })

    return { category, subcategories, secondarySubcategories, brands }
  }

  // 2️⃣ If subcategorySlug
  if (query.subcategorySlug) {
    subcategory = await Subcategory.findOne({
      slug: query.subcategorySlug,
      isDeleted: false,
      status: 'ACTIVE',
    }).populate('category')

    if (!subcategory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found')
    }

    category = subcategory.category

    // Get all subcategories for this category (to show hierarchy)
    subcategories = await Subcategory.find({
      category: category._id,
      isDeleted: false,
      status: 'ACTIVE',
    })

    // Get all secondary subcategories for ALL subcategories of this category
    const allSubcategoryIds = subcategories.map(s => s._id)
    secondarySubcategories = await SecondarySubcategory.find({
      subcategory: { $in: allSubcategoryIds },
      isDeleted: false,
      status: 'ACTIVE',
    })

    // Get all brands for this category
    brands = await Brand.find({
      category: category._id,
      isDeleted: false,
      status: 'ACTIVE',
    })

    return {
      category,
      subcategory,
      subcategories,
      secondarySubcategories,
      brands,
    }
  }

  // 3️⃣ If secondarySubcategorySlug
  if (query.secondarySubcategorySlug) {
    secondarySubcategory = await SecondarySubcategory.findOne({
      slug: query.secondarySubcategorySlug,
      isDeleted: false,
      status: 'ACTIVE',
    }).populate({
      path: 'subcategory',
      populate: { path: 'category' },
    })

    if (!secondarySubcategory) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Secondary subcategory not found'
      )
    }

    subcategory = await Subcategory.findOne({
      _id: secondarySubcategory.subcategory,
      isDeleted: false,
      status: 'ACTIVE',
    })
    if (!subcategory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found')
    }
    secondarySubcategory.subcategory

    category = subcategory.category

    // Get all subcategories for this category
    subcategories = await Subcategory.find({
      category: category._id,
      isDeleted: false,
      status: 'ACTIVE',
    })

    // Get all secondary subcategories for ALL subcategories of this category
    const allSubcategoryIds = subcategories.map(s => s._id)
    secondarySubcategories = await SecondarySubcategory.find({
      subcategory: { $in: allSubcategoryIds },
      isDeleted: false,
      status: 'ACTIVE',
    })

    // Get all brands for this category
    brands = await Brand.find({
      category: category._id,
      isDeleted: false,
      status: 'ACTIVE',
    })

    return {
      category,
      subcategory,
      secondarySubcategory,
      subcategories,
      secondarySubcategories,
      brands,
    }
  }

  // 4️⃣ If brandSlug
  if (query.brandSlug) {
    brand = await Brand.findOne({
      slug: query.brandSlug,
      isDeleted: false,
      status: 'ACTIVE',
    }).populate('category')

    if (!brand) {
      throw new AppError(httpStatus.NOT_FOUND, 'Brand not found')
    }

    category = brand.category

    // Get all subcategories for this category
    subcategories = await Subcategory.find({
      category: category._id,
      isDeleted: false,
      status: 'ACTIVE',
    })

    const subcategoryIds = subcategories.map(s => s._id)

    // Get all secondary subcategories for this category
    secondarySubcategories = await SecondarySubcategory.find({
      subcategory: { $in: subcategoryIds },
      isDeleted: false,
      status: 'ACTIVE',
    })

    // Get ALL brands for this category (including the selected one)
    brands = await Brand.find({
      category: category._id,
      isDeleted: false,
      status: 'ACTIVE',
    })

    return {
      category,
      brand,
      subcategories,
      secondarySubcategories,
      brands, // This will include the selected brand
    }
  }

  throw new AppError(
    httpStatus.BAD_REQUEST,
    'Please provide all, categorySlug, subcategorySlug, secondarySubcategorySlug, or brandSlug'
  )
}

export const CategoryService = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getSidebarDataforFilterOperation,
}
