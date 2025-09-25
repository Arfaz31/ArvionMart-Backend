import Redis from 'ioredis'
import config from '../config'

const redisClient = new Redis(config.redis_url || 'redis://localhost:6379')

redisClient.on('error', err => console.log('Redis Client Error', err))
redisClient.on('connect', () => console.log('✅ Redis connection successful!'))

export const checkRedisConnection = async () => {
  try {
    const ping = await redisClient.ping()
    if (ping !== 'PONG') {
      throw new Error('Redis connection failed: did not receive PONG')
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
    process.exit(1)
  }
}

export default redisClient
