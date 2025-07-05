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

//login
const loginUser = async (payload: IAuth) => {
  const { contactNumber, password } = payload
  const user = await User.findOne({ contactNumber })
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid phone or password')
  }
  const comparePassword = await bcrypt.compare(password, user.password)
  if (!comparePassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid phone or password')
  }

  const jwtPayload = {
    _id: user._id,
    userId: user.userId,
    contactNumber: user.contactNumber,
    email: user.email,
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

//vendor login
const vendorLogin = async (payload: IAuth) => {
  const { email, password } = payload
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password')
  }
  const comparePassword = await bcrypt.compare(password, user.password)
  if (!comparePassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password')
  }

  const jwtPayload = {
    _id: user._id,
    userId: user.userId,
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
    userId: isUserExist.userId,
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
    userId: isUserExist.userId,
    email: isUserExist.email,
    role: isUserExist.role,
  }

  const resetToken = jwtHelper.generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    '15m'
  )

  const resetPasswordLink = `http://localhost:3000?${isUserExist.email}&token=${resetToken}`

  sendEmail(
    isUserExist.email,
    resetHtmlBody(customerName.fullName, resetPasswordLink)
  )
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

export const AuthService = {
  loginUser,
  generateAccessToken,
  forgetPasswordLink,
  resetPassword,
  vendorLogin,
}
