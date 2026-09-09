import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limits (can be replaced with Redis for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations
export const RATE_LIMITS = {
  AUTH_LOGIN: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  AUTH_REGISTER: { requests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
  PASSWORD_RESET: { requests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
  API_GENERAL: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  ADMIN_MUTATIONS: { requests: 50, windowMs: 60 * 1000 }, // 50 mutations per minute
  TEACHER_MUTATIONS: { requests: 30, windowMs: 60 * 1000 }, // 30 mutations per minute
};

/**
 * Get client IP address from request headers
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

/**
 * Check if a request is rate limited
 * @param identifier - Unique identifier (user ID, IP address, etc.)
 * @param limit - Rate limit configuration
 * @returns Object with allowed flag and remaining count
 */
export function checkRateLimit(
  identifier: string,
  limit: {
    requests: number;
    windowMs: number;
  }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  let entry = rateLimitStore.get(key);

  // If no entry exists or window has expired, create new entry
  if (!entry || now >= entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + limit.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  entry.count++;

  const allowed = entry.count <= limit.requests;
  const remaining = Math.max(0, limit.requests - entry.count);
  const resetTime = entry.resetTime;

  return { allowed, remaining, resetTime };
}

import { createSupabaseAdminClient } from "./db";

/**
 * Increment rate limit counter
 * @param identifier - Unique identifier
 * @param limit - Rate limit configuration
 */
export function incrementRateLimit(
  identifier: string,
  limit: { requests: number; windowMs: number }
): void {
  checkRateLimit(identifier, limit);
}

/**
 * Reset rate limit for specific identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Stateful database-backed rate limiter for authentication endpoints
 */
export async function checkDatabaseRateLimit(
  identifier: string,
  limit: { requests: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = identifier;
  const now = new Date();
  
  try {
    const supabase = createSupabaseAdminClient();
    
    // Fetch rate limit record
    const { data: entry, error: selectError } = await supabase
      .from("rate_limits")
      .select("count, reset_time")
      .eq("key", key)
      .limit(1)
      .maybeSingle<{ count: number; reset_time: string }>();
      
    if (selectError) {
      console.warn("Database rate limit fetch failed, falling back to memory:", selectError.message);
      return checkRateLimit(key, limit);
    }
    
    const nowTime = now.getTime();
    
    if (!entry || nowTime >= new Date(entry.reset_time).getTime()) {
      // Row doesn't exist or window expired -> reset count
      const resetTime = new Date(nowTime + limit.windowMs).toISOString();
      const { error: upsertError } = await supabase
        .from("rate_limits")
        .upsert({
          key,
          count: 1,
          reset_time: resetTime
        }, { onConflict: "key" });
        
      if (upsertError) {
        console.warn("Database rate limit reset failed:", upsertError.message);
      }
      
      return { allowed: true, remaining: limit.requests - 1, resetTime: nowTime + limit.windowMs };
    }
    
    const nextCount = entry.count + 1;
    const allowed = nextCount <= limit.requests;
    const remaining = Math.max(0, limit.requests - nextCount);
    const resetTime = new Date(entry.reset_time).getTime();
    
    const { error: updateError } = await supabase
      .from("rate_limits")
      .update({ count: nextCount })
      .eq("key", key);
      
    if (updateError) {
      console.warn("Database rate limit count update failed:", updateError.message);
    }
    
    return { allowed, remaining, resetTime };
  } catch (err) {
    console.error("Database rate limit checking failed, falling back to memory:", err);
    return checkRateLimit(key, limit);
  }
}

/**
 * Enforce rate limit (asynchronous check against database with memory fallback)
 */
export async function enforceRateLimit(key: string, limit: { requests: number; windowMs: number }) {
  const result = await checkDatabaseRateLimit(key, limit);

  if (!result.allowed) {
    throw new Error("Too many attempts. Please try again later.");
  }
}

/**
 * Middleware for rate limiting based on IP address
 */
export function createIpRateLimitMiddleware(
  limit: { requests: number; windowMs: number }
) {
  return (request: NextRequest) => {
    const ip = getClientIp(request);
    const { allowed, remaining, resetTime } = checkRateLimit(ip, limit);

    return {
      allowed,
      remaining,
      resetTime,
      ip,
    };
  };
}

/**
 * Middleware for rate limiting based on user ID
 */
export function createUserRateLimitMiddleware(
  userId: string,
  limit: { requests: number; windowMs: number }
) {
  const { allowed, remaining, resetTime } = checkRateLimit(userId, limit);

  return {
    allowed,
    remaining,
    resetTime,
  };
}

/**
 * Clean up expired entries periodically
 */
export function cleanupExpiredRateLimits(): void {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredRateLimits, 5 * 60 * 1000);
