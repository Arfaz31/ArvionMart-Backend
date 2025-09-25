import { deleteCache, deleteCacheByPattern } from './cache'

export const clearProductCache = async (id?: string) => {
  //when a product is created, updated or deleted, then delete related caches
  await deleteCacheByPattern('products:*')
  if (id) {
    await deleteCache(`product:${id}`)
  }
  console.log('All product-related caches have been cleared.')
}
