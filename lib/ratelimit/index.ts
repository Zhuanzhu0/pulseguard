/**
 * Rate Limiting Utility
 *
 * This module provides rate limiting functionality for API routes.
 * To use, you need to:
 * 1. Install: npm install @upstash/ratelimit @upstash/redis
 * 2. Set environment variables:
 *    - UPSTASH_REDIS_REST_URL
 *    - UPSTASH_REDIS_REST_TOKEN
 *
 * Example usage in API routes:
 *
 * import { rateLimit, getRateLimitHeaders } from '@/lib/ratelimit';
 *
 * export async function POST(request: Request) {
 *   const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
 *   const { success, limit, reset, remaining } = await rateLimit.checkLimit(ip);
 *
 *   if (!success) {
 *     return new Response('Too Many Requests', {
 *       status: 429,
 *       headers: getRateLimitHeaders(limit, remaining, reset),
 *     });
 *   }
 *
 *   // Continue with your API logic...
 * }
 */

// Placeholder type definitions until @upstash/ratelimit is installed
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * In-memory rate limiter for development/fallback
 * Replace with Upstash rate limiter in production
 */
class InMemoryRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) {
    this.maxRequests = limit;
    this.windowMs = windowMs;
  }

  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.requests.get(identifier);

    // Clean up expired entries
    if (record && now > record.resetTime) {
      this.requests.delete(identifier);
    }

    const current = this.requests.get(identifier);

    if (!current) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: Math.floor((now + this.windowMs) / 1000),
      };
    }

    if (current.count >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: Math.floor(current.resetTime / 1000),
      };
    }

    current.count++;
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - current.count,
      reset: Math.floor(current.resetTime / 1000),
    };
  }
}

/**
 * Default rate limiter instance
 * Limits: 10 requests per minute per IP
 *
 * To use Upstash in production:
 * 1. npm install @upstash/ratelimit @upstash/redis
 * 2. Uncomment the Upstash implementation below
 */

// Production Upstash implementation (uncomment when ready):
// import { Ratelimit } from '@upstash/ratelimit';
// import { Redis } from '@upstash/redis';
//
// export const rateLimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, '60 s'),
//   analytics: true,
//   prefix: 'pulseguard',
// });

// Development/fallback in-memory implementation
export const rateLimit = new InMemoryRateLimiter(10, 60000);

// Stricter rate limiter for auth endpoints (5 requests per minute)
export const authRateLimit = new InMemoryRateLimiter(5, 60000);

// More permissive rate limiter for general API (30 requests per minute)
export const apiRateLimit = new InMemoryRateLimiter(30, 60000);

/**
 * Generate rate limit headers for responses
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };
}

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and other proxies
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "127.0.0.1"
  );
}
