import { Redis } from 'ioredis';
import { env } from '../config/env.js';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Required for BullMQ
  });

if (env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}
