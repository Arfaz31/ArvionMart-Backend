import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { AuthService } from './auth.service'

const login = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body)
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
    message: 'Login successfully',
    data: result,
  })
})

//vendor login
const loginVendor = catchAsync(async (req, res) => {
  const result = await AuthService.vendorLogin(req.body)
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
    message: 'Login successfully',
    data: result,
  })
})

//generate token
const generateToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies

  const result = await AuthService.generateAccessToken(refreshToken)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Access Token generate successfully',
    data: result,
  })
})

//forget-password
const forgetPassword = catchAsync(async (req, res) => {
  const result = await AuthService.forgetPasswordLink(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Reset password link sent successfully',
    data: result,
  })
})

//reset-password
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization
  const result = await AuthService.resetPassword(req.body, token as string)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset  successfully',
    data: result,
  })
})

export const AuthController = {
  login,
  loginVendor,
  generateToken,
  forgetPassword,
  resetPassword,
}
