import redisClient from './redisClient'

/**
 * ক্যাশ থেকে ডেটা খোঁজে, না পেলে ডেটাবেস থেকে এনে ক্যাশে সেট করে।
 * @param key - ক্যাশের জন্য ইউনিক কী (unique key)।
 * @param cb - ডেটাবেস থেকে ডেটা আনার জন্য কলব্যাক ফাংশন।
 * @param ttl - ক্যাশের মেয়াদ (Time To Live in seconds), ডিফল্ট ১ ঘণ্টা।
 * @returns - ক্যাশ বা ডেটাবেস থেকে পাওয়া ডেটা।
 */
export const getOrSetCache = async <T>(
  key: string,
  cb: () => Promise<T>,
  ttl = 3600 // 1 hour in seconds
): Promise<T> => {
  try {
    const cachedData = await redisClient.get(key)
    if (cachedData) {
      console.log(`CACHE HIT for key: ${key}`)
      return JSON.parse(cachedData) as T
    }

    console.log(`CACHE MISS for key: ${key}`)
    const freshData = await cb()
    // এখানে setex এর আর্গুমেন্টগুলো সঠিক ক্রমে দেওয়া হয়েছে: key, ttl, value
    await redisClient.setex(key, ttl, JSON.stringify(freshData))
    return freshData
  } catch (error) {
    console.error('Redis Error:', error)
    // Redis কাজ না করলে বা কোনো সমস্যা হলে সরাসরি ডেটাবেস থেকে ডেটা রিটার্ন করবে
    return cb()
  }
}

/**
 * একটি নির্দিষ্ট কী (key) দিয়ে ক্যাশ ডিলিট করে।
 * @param key - যে ক্যাশটি ডিলিট করতে হবে তার কী।
 */
export const deleteCache = async (key: string) => {
  try {
    await redisClient.del(key)
    console.log(`CACHE DELETED for key: ${key}`)
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error)
  }
}

/**
 * [Production Safe]
 * একটি নির্দিষ্ট প্যাটার্ন (pattern) ম্যাচ করে এমন সব ক্যাশ ডিলিট করে।
 * এটি 'SCAN' ব্যবহার করে, যা সার্ভার ব্লক করে না।
 * @param pattern - ডিলিট করার জন্য কী-এর প্যাটার্ন।
 */
export const deleteCacheByPattern = async (pattern: string) => {
  try {
    // scanStream একটি async iterator রিটার্ন করে, যা for await...of লুপের সাথে ব্যবহার করা যায়।
    const stream = redisClient.scanStream({
      match: pattern,
      count: 100, // প্রতিবারে কতগুলো কী স্ক্যান করবে
    })

    const allKeys: string[] = []

    // স্ট্রীম থেকে আসা প্রতিটি ব্যাচের কী-গুলোকে allKeys অ্যারেতে যোগ করা হচ্ছে।
    await new Promise<void>((resolve, reject) => {
      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          allKeys.push(...keys)
        }
      })
      stream.on('end', () => resolve())
      stream.on('error', err => reject(err))
    })

    // যদি কোনো কী পাওয়া যায়, তবে সেগুলোকে একসাথে ডিলিট করা হবে।
    if (allKeys.length > 0) {
      await redisClient.del(allKeys)
      console.log(`CACHE DELETED for pattern: "${pattern}"`, allKeys)
    }
  } catch (error) {
    console.error(`Error deleting cache for pattern "${pattern}":`, error)
  }
}
