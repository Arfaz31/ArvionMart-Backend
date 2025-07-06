import mongoose, { get } from 'mongoose'
import { ICustomer } from '../Customers/customers.interface'
import { IUser } from './user.interface'
import { User } from './user.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import { Customers } from '../Customers/customers.model'
import { jwtHelper } from '../../utils/jwtHelper'
import config from '../../config'
import { UserRole } from './user.contant'
import { Admin } from '../Admin/admin.model'
import { IAdmin } from '../Admin/admin.interface'

import { v4 as uuidv4 } from 'uuid'
import { Vendor } from '../Vendor/vendor.model'
import { IVendor } from '../Vendor/vendor.interface'
import QueryBuilder from '../../builder/QueryBuilder'

const generateUserId = (name: string): string => {
  const cleanName = name.trim().split(' ').join('').toLowerCase()
  const shortUuid = uuidv4().slice(0, 6) // keep it short & readable
  return `${cleanName}-${shortUuid}`
}

//REGISTER
const registerUser = async (password: string, payload: ICustomer) => {
  const userName = generateUserId(payload.fullName)

  const userData: Partial<IUser> = {
    userId: userName,
    email: payload.email,
    contactNumber: payload.contactNumber,
    password,
    role: UserRole.customer,
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const createdUser = await User.create([userData], { session })

    if (!createdUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed')
    }

    payload.user = createdUser[0]._id

    const createdCustomer = await Customers.create([payload], { session })

    if (!createdCustomer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Customer creation failed')
    }

    await session.commitTransaction()
    await session.endSession()

    const jwtPayload = {
      _id: createdUser[0]._id,
      userId: createdUser[0].userId,
      email: createdUser[0].email,
      role: createdUser[0].role,
    }

    const accessToken = jwtHelper.generateToken(
      jwtPayload,
      config.jwt.jwt_access_secret as string,
      config.jwt.jwt_access_expirein as string
    )

    const refreshToken = jwtHelper.generateToken(
      jwtPayload,
      config.jwt.jwt_refresh_secret as string,
      config.jwt.jwt_refresh_expirein as string
    )

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()

    // console.error('Registration Error:', error)

    throw new AppError(
      httpStatus.BAD_REQUEST,
      (error as Error).message || 'Account Registration failed'
    )
  }
}

//create-admin
const createAdmin = async (password: string, payload: IAdmin) => {
  const userName = generateUserId(payload.fullName)

  const existingUser = await User.findOne({ email: payload.email })
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists')
  }

  const userData: Partial<IUser> = {}

  //user-data
  userData.userId = userName
  userData.email = payload.email
  userData.contactNumber = payload.contactNumber
  userData.password = password
  userData.role = UserRole.admin

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const createUser = await User.create([userData], { session })

    if (!createUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Account Registration failed')
    }

    if (createUser.length > 0) {
      payload.user = createUser[0]._id
      const createAdmin = await Admin.create([payload], { session })

      if (!createAdmin.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Account Registration failed'
        )
      }

      await session.commitTransaction()
      await session.endSession()

      return createAdmin
    }
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error)
  }
}

//get all Admin
const getAllAdmin = async (query: Record<string, unknown>) => {
  const searchableFields = ['fullName', 'email']
  const adminQuery = await new QueryBuilder(
    Admin.find().populate('user'),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(Admin.find(), query).countTotal()
  return {
    count,
    adminQuery,
  }
}

//generate vendor id
const generateVendorId = async () => {
  // Find the vendor with the highest ID (sorted by descending order)
  const lastVendor = await Vendor.findOne().sort({ vendorId: -1 }).exec()

  if (!lastVendor) {
    return 'VD-00000001'
  }

  // Extract the numerical part of the last vendor ID
  const numericalPart = parseInt(lastVendor.vendorId.split('-')[1], 10)
  const incrementedId = (numericalPart + 1).toString().padStart(8, '0')
  return `VD-${incrementedId}`
}

//VENDOR REGISTER
const registerVendor = async (password: string, payload: IVendor) => {
  const existingUser = await User.findOne({ email: payload.email })
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists')
  }

  // Generate the next vendor ID
  payload.vendorId = await generateVendorId()

  const userData: Partial<IUser> = {
    userId: payload.vendorId,
    email: payload.email,
    password,
    role: UserRole.vendor,
    status: 'INACTIVE',
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const createdUser = await User.create([userData], { session })

    if (!createdUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed')
    }

    payload.user = createdUser[0]._id

    const createdVendor = await Vendor.create([payload], { session })

    if (!createdVendor.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Vendor creation failed')
    }

    await session.commitTransaction()
    await session.endSession()

    return createdVendor
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error)
  }
}

//get all user
const getAllCustomersFromDB = async () => {
  const result = await Customers.find().populate('user')
  return result
}

//Get me
const getMe = async (user: string) => {
  const isUserExist = await User.findOne({ _id: user })
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }

  if (isUserExist.role === UserRole.admin) {
    const getProfile = await Admin.findOne({ user: isUserExist._id }).populate(
      'user'
    )
    return getProfile
  } else if (isUserExist.role === UserRole.customer) {
    const getProfile = await Customers.findOne({
      user: isUserExist._id,
    }).populate('user')
    return getProfile
  }
}

//soft delete
const deleteUser = async (id: string) => {
  const _id = id
  const isUserExist = await User.findById(_id)
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    if (isUserExist.role === UserRole.customer) {
      await User.updateOne(
        { _id: _id },
        { $set: { isDeleted: true, status: 'INACTIVE' } },
        { session }
      )
      await Customers.updateOne(
        { user: _id },
        { $set: { isDeleted: true } },
        { session }
      )
    } else if (isUserExist.role === UserRole.admin) {
      await User.updateOne(
        { _id: _id },
        { $set: { isDeleted: true, status: 'INACTIVE' } },
        { session }
      )
      await Admin.updateOne(
        { user: _id },
        { $set: { isDeleted: true } },
        { session }
      )
    }
    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'User delete failed')
  }
}

export const UserSercive = {
  registerUser,
  registerVendor,
  createAdmin,
  getAllCustomersFromDB,
  getMe,
  deleteUser,
  getAllAdmin,
}
