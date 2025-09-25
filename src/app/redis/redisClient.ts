import Redis from 'ioredis'
import config from '../config'

let redisClient: Redis | null = null

const getRedisClient = () => {
  if (!redisClient) {
    console.log(
      'Creating new Redis client instance for serverless environment...'
    )

    if (!config.redis_url) {
      throw new Error('REDIS_URL is not defined in environment variables.')
    }

    redisClient = new Redis(config.redis_url, {
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: times => {
        if (times > 3) {
          return null
        }
        return Math.min(times * 200, 1000)
      },
    })

    redisClient.on('error', err => console.error('Redis Client Error:', err))
    redisClient.on('connect', () =>
      console.log('✅ Redis connection successful!')
    )
  }
  return redisClient
}

const client = getRedisClient()

export const checkRedisConnection = async () => {
  try {
    await client.connect()
    const ping = await client.ping()
    if (ping !== 'PONG') {
      throw new Error('Redis connection failed: did not receive PONG')
    }
    console.log('Redis connection check successful (PONG received).')
  } catch (error) {
    console.error('Failed to connect to Redis during check:', error)
    // Vercel-এ process.exit() ব্যবহার করা উচিত নয়
  }
}

export default client

// import Redis from 'ioredis'
// import config from '../config'

// const redisClient = new Redis(config.redis_url || 'redis://localhost:6379')

// redisClient.on('error', err => console.log('Redis Client Error', err))
// redisClient.on('connect', () => console.log('✅ Redis connection successful!'))

// export const checkRedisConnection = async () => {
//   try {
//     const ping = await redisClient.ping()
//     if (ping !== 'PONG') {
//       throw new Error('Redis connection failed: did not receive PONG')
//     }
//   } catch (error) {
//     console.error('Failed to connect to Redis:', error)
//     process.exit(1)
//   }
// }

// export default redisClient
