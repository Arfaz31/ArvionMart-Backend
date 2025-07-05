import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken'

const generateToken = (
  payload: JwtPayload,
  sceret: Secret,
  expiredIn: string | number
) => {
  return jwt.sign(payload, sceret, {
    expiresIn: expiredIn,
    algorithm: 'HS256',
  } as SignOptions)
}

export const jwtHelper = {
  generateToken,
}
