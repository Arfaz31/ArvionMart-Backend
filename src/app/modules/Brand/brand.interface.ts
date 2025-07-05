import { TStatus } from '../../interface/common.interface'

export interface IBrand {
  brandName: string
  slug: string
  description: string
  brandLogo?: string
  status: TStatus
  isDeleted: boolean
}
