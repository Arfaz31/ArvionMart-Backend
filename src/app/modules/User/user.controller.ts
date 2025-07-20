import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { UserService } from './user.service'

const register = catchAsync(async (req, res) => {
  const { password, customers } = req.body

  const result = await UserService.registerUser(password, customers)
  if (result) {
    const { refreshToken } = result
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Signup successfully',
    data: result,
  })
})

const createAdminIntoDB = catchAsync(async (req, res) => {
  const result = await UserService.createAdmin(req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Admin created successfully',
    data: result,
  })
})

//get all admin
const getAllAdminFromDB = catchAsync(async (req, res) => {
  const result = await UserService.getAllAdmin(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin get successfully',
    meta: result.count,
    data: result.adminQuery,
  })
})

//VENDOR REGISTRATION
const vendorRegister = catchAsync(async (req, res) => {
  const { password, vendor } = req.body
  const result = await UserService.registerVendor(password, vendor)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Vendor created successfully',
    data: result,
  })
})

const getAllCustomers = catchAsync(async (req, res) => {
  const result = await UserService.getAllCustomersFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Customers fetched successfully',
    meta: result.count,
    data: result.customerQuery,
  })
})

const getMeFromDB = catchAsync(async (req, res) => {
  const { _id } = req.user

  const result = await UserService.getMe(_id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile get successfully',
    data: result,
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserService.deleteUser(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: result,
  })
})

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateMyProfile(req)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: result,
  })
})

const updateUserProfileByAdmin = catchAsync(async (req, res) => {
  const result = await UserService.updateUserProfileByAdmin(req)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User profile updated successfully',
    data: result,
  })
})

export const UserController = {
  register,
  vendorRegister,
  createAdminIntoDB,
  getAllCustomers,
  getMeFromDB,
  deleteUser,
  getAllAdminFromDB,
  updateMyProfile,
  updateUserProfileByAdmin,
}
