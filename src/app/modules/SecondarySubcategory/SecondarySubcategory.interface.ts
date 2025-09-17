import { Types } from 'mongoose'
import { TStatus } from '../../interface/common.interface'

export interface ISecondarySubcategory {
  slug: string
  secondarySubcategoryName: string
  subcategory: Types.ObjectId
  isDeleted: boolean
  status: TStatus
}
