import { Types } from 'mongoose'
import { TStatus } from '../../interface/common.interface'

export interface ISecondarySubcategory {
  secondarySubcategoryName: string
  subcategory: Types.ObjectId
  isDeleted: boolean
  status: TStatus
}
