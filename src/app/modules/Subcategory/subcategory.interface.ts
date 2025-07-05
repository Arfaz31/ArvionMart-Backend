import { Types } from 'mongoose'
import { TStatus } from '../../interface/common.interface'

export interface ISubcategory {
  subcategoryName: string
  category: Types.ObjectId
  description: string
  slug: string
  imageUrl: string
  status: TStatus
  metaTags: string[]
  isDeleted: boolean
}
