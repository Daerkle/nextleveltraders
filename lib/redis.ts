import { Redis } from '@upstash/redis'

// Create a Redis client with error handling and connection validation
let redisClient: Redis | null = null

// Initialize Redis client with retry logic
export function getRedisClient(): Redis {
  if (redisClient) return redisClient

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.error('Redis environment variables are missing')
    throw new Error('Redis configuration is incomplete')
  }

  try {
    redisClient = new Redis({
      url,
      token,
      retry: {
        retries: 3,
        backoff: (retryCount) => Math.min(Math.exp(retryCount) * 50, 1000)
      }
    })
    
    console.log('Redis client initialized successfully')
    return redisClient
  } catch (error) {
    console.error('Failed to initialize Redis client:', error)
    throw new Error('Failed to connect to Redis')
  }
}

// Wrapper function for Redis get with error handling
export async function redisGet(key: string): Promise<string | null> {
  try {
    if (!key) {
      console.error('Redis GET: Key is required');
      return null;
    }
    
    const client = getRedisClient();
    const data = await client.get(key);
    
    // Add detailed logging for debugging
    console.log(`Redis GET for key ${key}:`, {
      dataType: typeof data,
      isNull: data === null,
      isObject: data !== null && typeof data === 'object',
      isArray: Array.isArray(data),
      valuePreview: data === null ? null : 
                   typeof data === 'object' ? JSON.stringify(data).substring(0, 100) + '...' : 
                   String(data).substring(0, 100) + '...'
    });
    
    // Handle different response types
    if (data === null) {
      return null;
    } else if (typeof data === 'object') {
      try {
        // If Redis returns an object directly, stringify it
        return JSON.stringify(data);
      } catch (stringifyError) {
        console.error(`Redis GET: Failed to stringify object for key ${key}:`, stringifyError);
        return null;
      }
    } else if (typeof data === 'string') {
      return data;
    } else {
      // Convert other types to string
      return String(data);
    }
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error);
    // Return null instead of throwing to prevent cascading failures
    return null;
  }
}

// Wrapper function for Redis set with error handling
export async function redisSet(key: string, value: any): Promise<boolean> {
  try {
    if (!key) {
      console.error('Redis SET: Key is required');
      return false;
    }
    
    const client = getRedisClient();
    
    // Log the value being set for debugging
    console.log(`Redis SET for key ${key}:`, {
      valueType: typeof value,
      valuePreview: typeof value === 'string' ? 
                   value.substring(0, 100) + (value.length > 100 ? '...' : '') : 
                   'non-string value'
    });
    
    await client.set(key, value);
    return true;
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error);
    throw error;
  }
}

// Wrapper function for Redis delete with error handling
export async function redisDel(key: string): Promise<void> {
  try {
    const client = getRedisClient()
    await client.del(key)
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error)
    throw error
  }
}

// Helper function to generate user-specific watchlist key
export function getUserWatchlistKey(userId: string): string {
  if (!userId) throw new Error('User ID is required')
  return `watchlist:${userId}`
}
