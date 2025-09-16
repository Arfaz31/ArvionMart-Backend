import { TStatus } from '../../interface/common.interface'

export interface ICategory {
  categoryName: string
  description: string
  slug: string
  imageUrl: string
  status: TStatus
  metaTags: string[]
  isDeleted: boolean
  flagSize?: string[]
  flagColor?: boolean
  flagCapacity?: boolean
  flagInternalStorage?: boolean
  flagOperatingSystem?: boolean
  flagRam?: boolean
}
