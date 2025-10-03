import { AppError } from '../../Error/AppError'
import { User } from '../User/user.model'
import { IAuth } from './auth.interface'
import httpStatus, { status } from 'http-status'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { sendEmail } from '../../utils/sendEmail'
// import { resetHtmlBody } from '../../view/resetPassword'
import { Customers } from '../Customers/customers.model'
import config from '../../config'
import { jwtHelper } from '../../utils/jwtHelper'
import { UserRole } from '../User/user.contant'
import mongoose from 'mongoose'
import { IUser } from '../User/user.interface'
import { ICustomer } from '../Customers/customers.interface'
import { optgenerateHtmlSendForUser } from '../../view/otphtml'

import crypto from 'crypto'

const OTP_EXPIRATION_MINUTES = 5
const MAX_OTP_ATTEMPTS = 5
const LOCKOUT_DURATION_MINUTES = 15

//generate otp for verification
const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString()
}

const loginUser = async (payload: IAuth) => {
  const { email } = payload
  let user = await User.findOne({ email })

  // step 1: check if user is locked
  if (user && user.otpLockoutUntil && user.otpLockoutUntil > new Date()) {
    const remainingMinutes = Math.ceil(
      (user.otpLockoutUntil.getTime() - Date.now()) / 60000
    )
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Account is locked. Please try again after ${remainingMinutes} minutes.`
    )
  }

  // step 2: if user doesn't exist then create a new user
  if (!user) {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()

      const userData: Partial<IUser> = {
        email: payload.email,
        role: UserRole.customer,
      }
      const newUserArr = await User.create([userData], { session })
      if (!newUserArr.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed')
      }
      const newUser = newUserArr[0]

      const customerData: Partial<ICustomer> = {
        user: newUser._id,
        email: payload.email,
        ...(payload.fullName && { fullName: payload.fullName }),
        ...(payload.profileImage && { profileImage: payload.profileImage }),
      }
      const newCustomerArr = await Customers.create([customerData], { session })
      if (!newCustomerArr.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Customer creation failed')
      }

      await session.commitTransaction()
      user = newUser // assign the new user to the user variable
    } catch (error: any) {
      await session.abortTransaction()
      throw new Error(error.message || 'Failed to create user.')
    } finally {
      await session.endSession()
    }
  }

  // step 3: generate OTP and send it to user's email address
  const otp = generateOtp()
  user.otp = otp
  user.otpExpiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000)
  user.failedOtpAttempts = 0 //  reset failed attempts count
  await user.save() // save user

  // step 4: send OTP to user's email
  const html = optgenerateHtmlSendForUser(otp)
  sendEmail(
    user.email!,
    html,
    'Arvion Mart - OTP Verification',
    `Your OTP is ${otp}`
  )

  return null
}

// Verify OTP
const verifyOtp = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload

  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP or email.')
  }

  // step 1: check if user is locked
  if (user.otpLockoutUntil && user.otpLockoutUntil > new Date()) {
    const remainingMinutes = Math.ceil(
      (user.otpLockoutUntil.getTime() - Date.now()) / 60000
    )
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Account is locked. Try again in ${remainingMinutes} minutes.`
    )
  }

  // step 2: Check if OTP is valid or not
  const isOtpValid = user.otp === otp
  const isOtpExpired = user.otpExpiresAt && user.otpExpiresAt < new Date()

  if (!isOtpValid || isOtpExpired) {
    // if OTP is invalid or expired then increase the failed attempt count
    user.failedOtpAttempts = (user.failedOtpAttempts || 0) + 1

    // lock the user's account if the failed attempt count cross it's limit
    if (user.failedOtpAttempts >= MAX_OTP_ATTEMPTS) {
      user.otpLockoutUntil = new Date(
        Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000
      )
    }
    await user.save()

    if (isOtpExpired) {
      throw new AppError(httpStatus.BAD_REQUEST, 'OTP has expired.')
    }
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP.')
  }

  // Reset everything after successfull verfication
  user.otp = undefined
  user.otpExpiresAt = undefined
  user.failedOtpAttempts = 0
  user.otpLockoutUntil = undefined
  await user.save()

  // Generate jwt token and return that
  const customerData = await Customers.findOne({ user: user._id }).select(
    '_id profileImage'
  )

  const jwtPayload = {
    userId: user._id,
    customerId: customerData?._id,
    email: user.email,
    profileImage: customerData?.profileImage,
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

//*customer google login
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
        userId: user[0]._id,
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
      userId: isUserExist?._id,
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

//*check token is correct or not or expired or not
const veryFyTokenForUser = async (token: string) => {
  const decoded = jwtHelper.verifyToken(
    token,
    config.jwt.jwt_access_secret as string
  )
  return decoded
}

//!vendor login-- Do not need our application
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
    userId: user._id,
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

//*generate-access-token-from-refresh-token
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
    userId: decoded._id,
    status: 'ACTIVE',
    isDeleted: false,
  })

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Your are not unauthorize')
  }

  const jwtPayload = {
    userId: isUserExist._id,
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

//!forget-password-- Do not need our application
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
    userId: isUserExist._id,
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

//!reset-password-- Do not need our application
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

//!dont need our application
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
  veryFyTokenForUser,
}
