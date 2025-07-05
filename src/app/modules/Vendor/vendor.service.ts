import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { Vendor } from './vendor.model'
import { User } from '../User/user.model'
import { Request } from 'express'

const getAllVendorsFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['vendorName', 'status']

  const vendorQuery = await new QueryBuilder(
    Vendor.find().populate('user'),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery
  const count = await new QueryBuilder(Vendor.find(), query).countTotal()

  return {
    count,
    vendorQuery,
  }
}

//get vendor profile
const getVendorProfile = async (req: Request) => {
  const user = req.user
  const result = await Vendor.findOne({ user: user._id }).populate('user')
  return result
}

//update vendor image
const updateVendorProfileImage = async (req: Request) => {
  const user = req.user
  const file = req.file
  console.log(file)

  const result = await Vendor.updateOne(
    { vendorId: user.userId },
    { $set: { profileImage: file?.path }, new: true }
  )
  return result
}

//accept vendor
const acceptVendor = async (payload: any) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const result = await User.updateOne(
      { userId: payload.vendorId },
      { $set: { status: 'ACTIVE' } },
      { session }
    )
    await Vendor.updateOne(
      { vendorId: payload.vendorId },
      { $set: { status: 'active' } },
      { session }
    )
    await session.commitTransaction()
    return result
  } catch (error) {
    await session.abortTransaction()
    throw error
  }
}

export const VendorService = {
  getAllVendorsFromDB,
  acceptVendor,
  getVendorProfile,
  updateVendorProfileImage,
}
