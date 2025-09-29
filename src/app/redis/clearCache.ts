import { deleteCache, deleteCacheByPattern } from './cache'

export const clearProductCache = async (id?: string) => {
  //when a product is created, updated or deleted, then delete related caches
  await deleteCacheByPattern('products:*')
  if (id) {
    await deleteCache(`product:${id}`)
  }
  console.log('All product-related caches have been cleared.')
}

export const clearCategoryCache = async (id?: string) => {
  //when a category is created, updated or deleted, then delete related caches
  await deleteCacheByPattern('categories:*')
  if (id) {
    await deleteCache(`category:${id}`)
  }
  console.log('All category-related caches have been cleared.')
}

export const clearSidebarCache = async () => {
  await deleteCacheByPattern('sidebar:filter:*')
  console.log('All sidebar-filter caches have been cleared.')
}
