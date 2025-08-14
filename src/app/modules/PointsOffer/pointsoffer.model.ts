import { model, Schema } from 'mongoose'
import { IPoints } from './pointsoffer.interface'

const pointsOfferSchema = new Schema<IPoints>({
  points: { type: Number, required: true },
  discountAmount: { type: Number, required: true },
})

export const PointsOffer = model<IPoints>('PointsOffer', pointsOfferSchema)
