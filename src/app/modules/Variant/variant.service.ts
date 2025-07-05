import { Request } from 'express'

import httpStatus from 'http-status'
import { Variant } from './variant.model'
import { AppError } from '../../Error/AppError'
import { Product } from '../Product/product.model'
import QueryBuilder from '../../builder/QueryBuilder'
import mongoose from 'mongoose'

export interface CustomFile extends Express.Multer.File {
  path: string
}

const createVariantIntoDB = async (req: Request) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const payload = req.body
    const files = req.files as { [fieldname: string]: CustomFile[] }

    // Handle uploaded images
    if (files && files['variant-Image']) {
      payload.image = files['variant-Image'].map(
        (file: CustomFile) => file.path
      )
    }

    const productId = payload.productId

    // Step 1: Check product existence
    const product = await Product.findById(productId).session(session)
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist')
    }

    // Step 2: Activate product if inactive
    if (!product.isActive) {
      product.isActive = true
      await product.save({ session })
    }

    // Step 3: Calculate total quantity from size[] or simple quantity
    let totalVariantQuantity = 0

    if (payload.size && Array.isArray(payload.size)) {
      // Ensure `size` is parsed (in case of stringified array)
      const sizeArray =
        typeof payload.size[0] === 'string'
          ? JSON.parse(payload.size)
          : payload.size

      totalVariantQuantity = sizeArray.reduce((sum: number, sizeObj: any) => {
        return sum + Number(sizeObj.quantity || 0)
      }, 0)

      // Save parsed size back (important if it was string)
      payload.size = sizeArray
    } else if (payload.quantity) {
      totalVariantQuantity = Number(payload.quantity)
    }

    // Step 4: Create new variant
    const variant = await Variant.create([{ ...payload }], { session })
    const newVariant = variant[0]

    // Step 5: Update product with new variant and quantity
    product.variant = product.variant || []
    product.variant.push(newVariant._id)
    product.quantity = (product.quantity ?? 0) + totalVariantQuantity

    await product.save({ session })

    // Step 6: Commit and end transaction
    await session.commitTransaction()
    session.endSession()

    return newVariant
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    // console.error('Variant creation failed:', error)
    // throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create variant')
    throw error
  }
}

const getAllVariants = async (query: Record<string, unknown>) => {
  const searchableFields = ['features', 'productSKU']
  const variantQuery = new QueryBuilder(Variant.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields()

  const count = await variantQuery.countTotal()
  const result = await variantQuery.modelQuery
  return result
}

const getVariantsByProduct = async (productId: string) => {
  const result = await Variant.find({ productId }).populate('productId')

  if (!result || result.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No variants found for this product'
    )
  }

  return result
}

const getSingleVariant = async (id: string) => {
  const result = await Variant.findById(id).populate('productId')

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Variant does not exist')
  }

  return result
}

const updateVariant = async (req: Request) => {
  const { id: _id } = req.params
  const payload = req.body

  const isExist = await Variant.findById(_id)
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Variant does not exist')
  }

  if (req.files && 'variant-image' in req.files) {
    const files = req.files['variant-image'] as Express.Multer.File[] // Access the array using the key
    payload.image = files.map(file => file.path)
  }

  // Filter out undefined/null/empty values
  const filteredPayload = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  const result = await Variant.findOneAndUpdate({ _id }, filteredPayload, {
    new: true,
  }).populate('productId')

  return result
}

const deleteVariant = async (id: string) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const _id = id

    // Step 1: Find the variant
    const variant = await Variant.findById(_id).session(session)
    if (!variant) {
      throw new AppError(httpStatus.NOT_FOUND, 'Variant does not exist')
    }

    // Step 2: Delete the variant
    const result = await Variant.findByIdAndDelete(_id, { session })

    // Step 3: Remove the variant ID from product's variant array
    await Product.findByIdAndUpdate(
      variant.productId,
      { $pull: { variant: _id } },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    return result
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete variant')
  }
}

const updateVariantQuantity = async (variantId: string, quantity: number) => {
  const variant = await Variant.findById(variantId)

  // if (!variant) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Variant not found')
  // }

  // if (variant.quantity + quantity < 0) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient stock quantity')
  // }

  // variant.quantity += quantity
  // await variant.save()

  return variant
}

export const VariantService = {
  createVariantIntoDB,
  getAllVariants,
  getVariantsByProduct,
  getSingleVariant,
  updateVariant,
  deleteVariant,
  updateVariantQuantity,
}
