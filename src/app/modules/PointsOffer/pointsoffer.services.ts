import { Request } from 'express'

import httpStatus from 'http-status'
import { PointsOffer } from './pointsoffer.model'
import { AppError } from '../../Error/AppError'

const createPointsOffer = async (req: Request) => {
  const payload = req.body

  // Check if points already exist
  const isPointsOfferExist = await PointsOffer.findOne({
    points: payload.points,
  })

  if (isPointsOfferExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Points offer already exists')
  }

  const result = await PointsOffer.create(payload)
  return result
}

const getAllPointsOffer = async (req: Request) => {
  const pointsOffers = await PointsOffer.find()
  return pointsOffers
  //   const pointsOfferQuery = await new QueryBuilder(
  //     getVendorPointsOffer.find(),
  //     req.query
  //   )
  //     .filter()
  //     .sort()
  //     .pagination()
  //     .fields().modelQuery

  //   const count = await new QueryBuilder(
  //     getVendorPointsOffer.find(),
  //     req.query
  //   ).countTotal()

  //   return {
  //     count,
  //     pointsOfferQuery,
  //   }
}

const updatePointsOffer = async (req: Request) => {
  const payload = req.body
  const id = req.params.id

  // refine payload
  const filter = Object.keys(payload).reduce((acc: any, key) => {
    if (payload[key] !== undefined && payload[key] !== '') {
      acc[key] = payload[key]
    }
    return acc
  }, {})

  const isPointsOfferExist = await PointsOffer.findById(id)
  if (!isPointsOfferExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Points offer not found')
  }

  const result = await PointsOffer.findByIdAndUpdate(id, filter, {
    new: true,
  })
  return result
}

const deletePointsOffer = async (req: Request) => {
  const id = req.params.id

  const isPointsOfferExist = await PointsOffer.findById(id)
  if (!isPointsOfferExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Points offer not found')
  }

  const result = await PointsOffer.findByIdAndDelete(id)
  return result
}

export const PointsOfferService = {
  createPointsOffer,
  getAllPointsOffer,
  updatePointsOffer,
  deletePointsOffer,
}
