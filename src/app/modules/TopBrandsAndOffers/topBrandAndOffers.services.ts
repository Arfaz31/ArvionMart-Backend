import { Request } from 'express'

import QueryBuilder from '../../builder/QueryBuilder'
import { Brand } from '../Brand/brand.model'
import { Product } from '../Product/product.model'
import { BrandOffer } from './topBrandAndOffers.model'

export const searchableFields = [
  'brandId',
  'name',
  'productId',
  'isTopBrand',
  'status',
]
const createBrandOffer = async (req: Request) => {
  const payload = req.body
  const file = req.file

  if (file) {
    payload.image = file.path
  }

  // Validate that either brandId or productId is provided
  if (!payload.brandId && !payload.productId) {
    throw new Error('Either brandId or productId must be provided')
  }

  // Check if the brand or product exists
  if (payload.brandId) {
    const brand = await Brand.findById(payload.brandId)
    if (!brand) {
      throw new Error('Brand not found')
    }
  }

  if (payload.productId) {
    const product = await Product.findById(payload.productId)
    if (!product) {
      throw new Error('Product not found')
    }
  }

  const result = await BrandOffer.create(payload)
  return result
}

const getAllBrandOffers = async (query: Record<string, unknown>) => {
  const brandOfferQuery = new QueryBuilder(
    BrandOffer.find({ isDeleted: false })
      .populate('brandId')
      .populate('productId'),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await brandOfferQuery.modelQuery
  const meta = await brandOfferQuery.countTotal()

  return {
    meta,
    data: result,
  }
}

const getTopBrandOffers = async () => {
  const result = await BrandOffer.find({ isTopBrand: true, isDeleted: false })
    .populate('brandId')
    .limit(10)
  return result
}

const updateBrandOffer = async (req: Request) => {
  const { id } = req.params
  const payload = req.body
  const file = req.file

  if (file) {
    payload.image = file.path
  }

  // Validate that either brandId or productId is provided if they are in payload
  if (payload.brandId || payload.productId) {
    if (payload.brandId) {
      const brand = await Brand.findById(payload.brandId)
      if (!brand) {
        throw new Error('Brand not found')
      }
    }

    if (payload.productId) {
      const product = await Product.findById(payload.productId)
      if (!product) {
        throw new Error('Product not found')
      }
    }
  }

  const result = await BrandOffer.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}

const deleteBrandOffer = async (id: string) => {
  const result = await BrandOffer.findByIdAndUpdate(
    id,
    { isDeleted: true, status: 'INACTIVE' },
    { new: true }
  )
  return result
}

export const BrandOfferService = {
  createBrandOffer,
  getAllBrandOffers,
  getTopBrandOffers,
  updateBrandOffer,
  deleteBrandOffer,
}
