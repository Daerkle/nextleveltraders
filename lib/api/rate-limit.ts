import { NextRequest, NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/config/subscriptions';
import { checkRateLimit } from '@/lib/rate-limiter';

interface RateLimitConfig {
  limit: number;
  window: string;
}

interface RateLimitOptions {
  freeTier: RateLimitConfig;
  proTier: RateLimitConfig;
}

const RATE_LIMITS: RateLimitOptions = {
  freeTier: {
    limit: 100,
    window: '1 h',
  },
  proTier: {
    limit: 1000,
    window: '1 h',
  },
};

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
  error?: string;
}

export async function getRateLimitInfo(
  req: NextRequest,
  options: Partial<RateLimitOptions> = {}
): Promise<RateLimitResult> {
  try {
    // Identifiziere den Client
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const rateLimitId = req.cookies.get('rate-limit-id')?.value;
    
    // Bestimme den Plan
    const plan = req.headers.get('x-subscription-plan') || SUBSCRIPTION_PLANS.FREE;
    const identifier = rateLimitId || `${plan}:${forwardedFor || realIp || 'unknown'}`;

    // Kombiniere Standard- und benutzerdefinierte Limits
    const limits = {
      freeTier: { ...RATE_LIMITS.freeTier, ...options.freeTier },
      proTier: { ...RATE_LIMITS.proTier, ...options.proTier },
    };

    // Wähle die entsprechenden Limits basierend auf dem Plan
    const tierConfig = plan === SUBSCRIPTION_PLANS.PRO ? limits.proTier : limits.freeTier;

    // Prüfe das Rate Limit
    const result = await checkRateLimit(
      identifier,
      plan === SUBSCRIPTION_PLANS.PRO ? 'pro' : 'free'
    );

    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: tierConfig.limit,
    };
  } catch (error) {
    console.error('Fehler beim Prüfen des Rate Limits:', error);
    return {
      success: true, // Im Fehlerfall erlauben wir den Request
      remaining: 100,
      reset: Date.now() + 3600000,
      limit: 100,
      error: 'Rate Limit Check fehlgeschlagen',
    };
  }
}

export function decorateResponseWithRateLimit(
  response: Response,
  rateLimitResult: RateLimitResult
): Response {
  const headers = new Headers(response.headers);
  
  // Füge Rate Limit Headers hinzu
  headers.set('X-RateLimit-Limit', String(rateLimitResult.limit));
  headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
  headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString());

  if (!rateLimitResult.success) {
    headers.set('Retry-After', String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)));
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function handleRateLimit(
  req: NextRequest,
  handler: () => Promise<Response>,
  options?: Partial<RateLimitOptions>
): Promise<Response> {
  const rateLimitResult = await getRateLimitInfo(req, options);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Rate limit überschritten',
        retryAfter: new Date(rateLimitResult.reset).toISOString(),
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const response = await handler();
    return decorateResponseWithRateLimit(response, rateLimitResult);
  } catch (error) {
    console.error('Fehler im Rate-Limited Handler:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// Helper-Funktion zum Erstellen eines Rate-Limited Handlers
export function createRateLimitedHandler(
  handler: (req: NextRequest) => Promise<Response>,
  options?: Partial<RateLimitOptions>
) {
  return async function rateLimitedHandler(req: NextRequest) {
    return handleRateLimit(req, () => handler(req), options);
  };
}