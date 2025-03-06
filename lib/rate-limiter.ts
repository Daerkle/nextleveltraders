import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Definiere verschiedene Rate Limiter für verschiedene Pläne
export const rateLimiters = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
    analytics: true,
    prefix: 'ratelimit:free',
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '1 h'), // 1000 requests per hour
    analytics: true,
    prefix: 'ratelimit:pro',
  }),
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export async function checkRateLimit(
  identifier: string,
  plan: 'free' | 'pro'
): Promise<RateLimitResult> {
  try {
    const limiter = rateLimiters[plan];
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Im Fehlerfall erlauben wir den Request
    return {
      success: true,
      limit: plan === 'pro' ? 1000 : 100,
      remaining: plan === 'pro' ? 999 : 99,
      reset: Date.now() + 3600000, // 1 hour from now
    };
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}

export async function isRateLimited(
  identifier: string,
  plan: 'free' | 'pro'
): Promise<boolean> {
  const result = await checkRateLimit(identifier, plan);
  return !result.success;
}