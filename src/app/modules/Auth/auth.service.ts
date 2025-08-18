import { AppError } from '../../Error/AppError'
import { User } from '../User/user.model'
import { IAuth } from './auth.interface'
import httpStatus, { status } from 'http-status'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { sendEmail } from '../../utils/sendEmail'
import { resetHtmlBody } from '../../view/resetPassword'
import { Customers } from '../Customers/customers.model'
import config from '../../config'
import { jwtHelper } from '../../utils/jwtHelper'
import { UserRole } from '../User/user.contant'
import mongoose from 'mongoose'
import { IUser } from '../User/user.interface'
import { ICustomer } from '../Customers/customers.interface'
import { optgenerateHtmlSendForUser } from '../../view/otphtml'
import { Admin } from '../Admin/admin.model'

//generate otp for verification
const generateOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  return otp
}

//contact number login
const loginUser = async (payload: IAuth) => {
  const { email } = payload
  const user = await User.findOne({ email })

  if (!user) {
    //using transaction and rollbacke create cutomers
    const session = await mongoose.startSession()
    try {
      session.startTransaction()

      const userData: Partial<IUser> = {
        email: payload.email,
        role: UserRole.customer,
      }

      const user = await User.create([userData], { session })

      if (!user.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed')
      }

      const customerData: Partial<ICustomer> = {
        user: user[0]._id,
        ...(payload.fullName && { fullName: payload.fullName }),
        email: payload.email,
        ...(payload.profileImage && { profileImage: payload.profileImage }),
      }

      const customer = await Customers.create([customerData], { session })
      if (!customer.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Customer creation failed')
      }

      await session.commitTransaction()
      await session.endSession()

      const otp = await generateOtp()
      //save into user collection and set expiration
      user[0].otp = otp
      user[0].otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
      //update user collection not save
      await User.updateOne(
        { _id: user[0]._id },
        { otp: user[0].otp, otpExpiresAt: user[0].otpExpiresAt }
      )

      const html = optgenerateHtmlSendForUser(otp)
      await sendEmail(
        customer[0]?.email,
        html,
        'Arvion Mart - OTP Verification',
        `Your OTP is ${otp}`
      )
    } catch (error: any) {
      await session.abortTransaction()
      await session.endSession()
      throw new Error(error)
    }
  } else {
    const otp = await generateOtp()
    const html = optgenerateHtmlSendForUser(otp)
    if (!user?.email) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'User email is required for OTP'
      )
    }
    user.otp = otp
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
    //update user collection not save
    await User.updateOne(
      { _id: user._id },
      { otp: user.otp, otpExpiresAt: user.otpExpiresAt }
    )
    await sendEmail(
      user.email,
      html,
      'Arvion Mart - OTP Verification',
      `Your OTP is ${otp}`
    )
  }
}

//verify otp
const verifyOtp = async (payload: { otp: string }) => {
  const user = await User.findOne({ otp: payload.otp })
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }
  if (user.otp !== payload.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP')
  }
  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP has expired')
  }
  // OTP is valid, proceed with login or other actions. create jwt token

  if (user?.role === UserRole.admin || user?.role === UserRole.superAdmin) {
    const adminData = await Admin.findOne({ user: user._id }).select(
      '_id,profileImage'
    )

    const jwtPayload = {
      userId: user._id,
      ...(adminData && { adminId: adminData._id }),
      email: user.email,
      ...(adminData && { profileImage: adminData?.profileImage }),
      role: user.role,
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
  } else {
    const customersData = await Customers.findOne({ user: user._id }).select(
      '_id,profileImage'
    )
    const jwtPayload = {
      userId: user._id,
      ...(customersData && { customerId: customersData._id }),
      email: user.email,
      ...(customersData && { profileImage: customersData?.profileImage }),
      role: user.role,
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
  }
}

//customer google login
const googleLogin = async (payload: IAuth) => {
  const isUserExist = await User.findOne({
    email: payload.email,
    status: 'ACTIVE',
    isDeleted: false,
  })

  if (!isUserExist) {
    //start mongoose session
    const session = await mongoose.startSession()
    try {
      session.startTransaction()

      const userData: Partial<IUser> = {
        email: payload.email,
        role: UserRole.customer,
      }

      const user = await User.create([userData], { session })

      if (!user.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed')
      }

      const customerData: Partial<ICustomer> = {
        user: user[0]._id,
        fullName: payload.fullName,
        email: payload.email,
        profileImage: payload.profileImage,
      }

      const customer = await Customers.create([customerData], { session })
      if (!customer.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Customer creation failed')
      }

      await session.commitTransaction()
      await session.endSession()

      const jwtPayload = {
        _id: user[0]._id,
        email: user[0].email,
        role: user[0].role,
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
    } catch (error: any) {
      await session.abortTransaction()
      await session.endSession()
      throw new Error(error)
    }
  } else {
    const jwtPayload = {
      _id: isUserExist?._id,
      email: isUserExist?.email,
      role: isUserExist?.role,
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
  }
}

//vendor login
const vendorLogin = async (payload: IAuth) => {
  const { email, password } = payload
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password')
  }
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is required')
  }
  const comparePassword = await bcrypt.compare(
    password,
    user.password as string
  )
  if (!comparePassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password')
  }

  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
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
}

//generate-access-token-from-refresh-token
const generateAccessToken = async (token: string) => {
  let decoded
  try {
    decoded = jwt.verify(
      token,
      config.jwt.jwt_refresh_secret as string
    ) as JwtPayload
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Your are not unauthorize')
  }

  const isUserExist = await User.findOne({
    _id: decoded._id,
    status: 'ACTIVE',
    isDeleted: false,
  })

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Your are not unauthorize')
  }

  const jwtPayload = {
    _id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  }

  const accessToken = jwtHelper.generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expirein as string
  )

  return {
    accessToken,
  }
}

//forget-password
const forgetPasswordLink = async (payload: IAuth) => {
  const isUserExist = await User.findOne({
    email: payload.email,
    status: 'ACTIVE',
    isDeleted: false,
  })

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }

  const customerName = await Customers.findOne({
    email: isUserExist.email,
    isDeleted: false,
  })

  if (!customerName) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }

  const jwtPayload = {
    _id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  }

  const resetToken = jwtHelper.generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    '15m'
  )

  const resetPasswordLink = `http://localhost:3000?${isUserExist.email}&token=${resetToken}`

  // sendEmail(
  //   isUserExist.email,
  //   resetHtmlBody(customerName.fullName, resetPasswordLink)
  // )
}

//reset-password
const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  // 1. Find the user
  const user = await User.findOne({
    email: payload.email,
    status: 'ACTIVE',
    isDeleted: false,
  })

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }

  let decoded
  try {
    decoded = jwt.verify(
      token,
      config.jwt.jwt_access_secret as string
    ) as JwtPayload
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token')
  }

  if (payload.email !== decoded.email || payload.email !== user.email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email mismatch')
  }

  const hashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_rounds)
  )

  await User.findByIdAndUpdate(
    user._id,
    {
      password: hashPassword,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  )
}

const updatePasswordForStaff = async (payload: any, user: any) => {
  const { id: targetUserId, newPassword } = payload
  const currentUser = user

  if (!targetUserId || !newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields')
  }

  const targetUser = await User.findById(targetUserId)
  if (!targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Target user not found')
  }

  const requesterRole = currentUser.role
  const requesterId = currentUser._id.toString()
  const targetRole = targetUser.role
  const targetId = targetUser._id.toString()

  // Authorization rules
  if (requesterRole === UserRole.superAdmin) {
    // superAdmin can update any user's password
  } else if (requesterRole === UserRole.admin) {
    // admin can update only customer passwords
    if (targetRole !== UserRole.customer) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Admin can only update customer passwords'
      )
    }
  } else if (requesterRole === UserRole.customer) {
    // customer can update only their own password
    if (requesterId !== targetId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Customers can only update their own password'
      )
    }
  } else {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized role')
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.salt_rounds)
  )

  await User.findByIdAndUpdate(
    targetUserId,
    {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
    { new: true }
  )

  return {
    message: 'Password updated successfully',
  }
}

export const AuthService = {
  loginUser,
  generateAccessToken,
  forgetPasswordLink,
  resetPassword,
  updatePasswordForStaff,
  vendorLogin,
  googleLogin,
  verifyOtp,
}
