import { createRateLimitedHandler } from '@/lib/api/rate-limit';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function handler(req: NextRequest) {
  // Simuliere eine Verarbeitungszeit
  await new Promise(resolve => setTimeout(resolve, 100));

  return NextResponse.json({
    message: 'Rate-Limited API Test',
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(req.headers.entries()),
  });
}

// Erstelle einen rate-limited Handler mit benutzerdefinierten Limits
export const GET = createRateLimitedHandler(handler, {
  freeTier: {
    limit: 5,    // 5 Anfragen
    window: '1m', // pro Minute
  },
  proTier: {
    limit: 30,   // 30 Anfragen
    window: '1m', // pro Minute
  },
});

// Test durch Ausführen von:
/*
  async function testRateLimit() {
    const results = [];
    for (let i = 0; i < 10; i++) {
      const res = await fetch('/api/test-rate-limit');
      const data = await res.json();
      results.push({
        status: res.status,
        remaining: res.headers.get('x-ratelimit-remaining'),
        data,
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.table(results);
  }
  
  testRateLimit();
*/