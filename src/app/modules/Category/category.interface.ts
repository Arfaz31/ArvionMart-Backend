import { TStatus } from '../../interface/common.interface'

export interface ICategory {
  categoryName: string
  description: string
  slug: string
  imageUrl: string
  status: TStatus
  metaTags: string[]
  isDeleted: boolean
}
