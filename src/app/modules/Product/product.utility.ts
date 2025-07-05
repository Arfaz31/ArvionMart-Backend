import { format } from 'date-fns'
import { Product } from './product.model'
import { Category } from '../Category/category.model'

export const generateSku = async (categoryId: string): Promise<string> => {
  const category = await Category.findById(categoryId)
  if (!category) {
    throw new Error('Invalid category for SKU generation')
  }

  const categoryWord =
    category.categoryName?.split(' ')[0]?.toLowerCase() || 'item'
  const dateStr = format(new Date(), 'yyyyMMdd')

  // Count existing products for today in this category
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  const count = await Product.countDocuments({
    category: categoryId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })

  const serial = String(count + 1).padStart(2, '0') // 01, 02, 03 ...
  return `${categoryWord}-${dateStr}-${serial}`
}
