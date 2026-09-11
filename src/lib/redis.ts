import { Redis } from '@upstash/redis';

// Singleton Redis client instance
const getRedisClient = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Fallback or null if env vars aren't set yet (prevents build crash)
    return null;
  }
  
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
};

export const redis = getRedisClient();
