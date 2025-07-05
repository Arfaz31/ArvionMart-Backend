import { AppError } from '../Error/AppError'
import { UserRole } from '../modules/User/user.contant'
import catchAsync from '../utils/catchAsync'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { User } from '../modules/User/user.model'

const auth = (...roles: (keyof typeof UserRole)[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    let decoded
    try {
      decoded = jwt.verify(
        token,
        config.jwt.jwt_access_secret as string
      ) as JwtPayload
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }
    const { email, role } = decoded
    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    if (isUserExist.status === 'INACTIVE') {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    if (roles.length && !roles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'Forbidden')
    }
    req.user = isUserExist as JwtPayload
    next()
  })
}

export default auth
