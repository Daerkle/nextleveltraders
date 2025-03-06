import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getRequestIp } from "@/lib/utils/request";
import { env } from "@/env.mjs";

export interface RateLimitOptions {
  /**
   * Maximum number of requests within the window
   */
  max: number;
  /**
   * Time window in seconds
   */
  window: number;
  /**
   * Error message for rate limit exceeded
   */
  message?: string;
  /**
   * Custom identifier for the rate limit
   */
  identifier?: string;
}

export type RateLimitMiddleware = (
  req: NextRequest
) => Promise<NextResponse | null>;

/**
 * Creates a rate limiting middleware with the given options
 */
export function withRateLimit(options: RateLimitOptions): RateLimitMiddleware {
  const {
    max,
    window,
    message = "Too many requests",
    identifier = "global",
  } = options;

  // Initialize Redis client
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Create rate limiter
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${window}s`),
  });

  return async function rateLimitMiddleware(
    request: NextRequest
  ): Promise<NextResponse | null> {
    try {
      // Get client identifier (IP + optional custom identifier)
      const ip = getRequestIp(request);
      const key = `${identifier}:${ip}`;

      // Check rate limit
      const result = await ratelimit.limit(key);

      // Set rate limit headers
      const headers = new Headers({
        "X-RateLimit-Limit": max.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": new Date(result.reset).toISOString(),
      });

      // If rate limit is exceeded, return 429 Too Many Requests
      if (!result.success) {
        return new NextResponse(
          JSON.stringify({
            error: "rate_limit_exceeded",
            message,
            retryAfter: result.reset,
          }),
          {
            status: 429,
            headers: {
              ...headers,
              "Content-Type": "application/json",
              "Retry-After": Math.ceil(
                (result.reset - Date.now()) / 1000
              ).toString(),
            },
          }
        );
      }

      // Rate limit not exceeded, continue with request
      const response = NextResponse.next();

      // Add rate limit headers to response
      headers.forEach((value, key) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error("Rate limit error:", error);

      // In case of error, allow the request but log the error
      return null;
    }
  };
}

/**
 * Creates a rate limit middleware with default options
 */
export function createDefaultRateLimiter(identifier?: string): RateLimitMiddleware {
  return withRateLimit({
    max: 60,
    window: 60,
    message: "Too many requests. Please try again later.",
    identifier,
  });
}

/**
 * Creates a stricter rate limit middleware for sensitive operations
 */
export function createStrictRateLimiter(identifier?: string): RateLimitMiddleware {
  return withRateLimit({
    max: 10,
    window: 60,
    message: "Too many attempts. Please try again in a few minutes.",
    identifier,
  });
}

/**
 * Helper function to check if a response is a rate limit error
 */
export function isRateLimitError(response: Response): boolean {
  return response.status === 429;
}

/**
 * Helper function to parse rate limit headers
 */
export function parseRateLimitHeaders(headers: Headers) {
  return {
    limit: parseInt(headers.get("X-RateLimit-Limit") || "0", 10),
    remaining: parseInt(headers.get("X-RateLimit-Remaining") || "0", 10),
    reset: new Date(headers.get("X-RateLimit-Reset") || Date.now()),
  };
}