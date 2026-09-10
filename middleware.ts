import { Redis } from '@upstash/redis';
import { NextResponse, NextRequest } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// ── Per-route rate limits ─────────────────────────────────────────────────────
function getLimit(pathname: string, method: string): number {
  if (pathname === '/api/admin/auth')             return 5;
  if (pathname === '/api/payment/verify')         return 5;
  if (pathname === '/api/payment/verify-manual')  return 10;
  if (pathname === '/api/payment/create-order')   return 10;
  if (pathname === '/api/proposals/save')         return 3;
  if (pathname === '/api/custom-requests' && method === 'POST') return 5;
  if (pathname === '/api/notify')                 return 10;
  if (pathname === '/api/upload/image')           return 10;
  if (method === 'POST')                          return 20;
  return 60;
}

// ── Security headers ──────────────────────────────────────────────────────────
function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options',  'nosniff');
  res.headers.set('X-Frame-Options',         'DENY');
  res.headers.set('X-XSS-Protection',        '1; mode=block');
  res.headers.set('Referrer-Policy',         'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy',      'camera=(), microphone=(), geolocation=(), payment=()');
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    const ip = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    const limit = getLimit(pathname, req.method);
    const ratelimitKey = `ratelimit:${ip}:${req.method}:${pathname}`;

    try {
      const requests = await redis.incr(ratelimitKey);
      if (requests === 1) {
        await redis.expire(ratelimitKey, 60); // 1 minute window
      }

      if (requests > limit) {
        const res = NextResponse.json(
          { error: 'Too many requests. Please wait before trying again.', retryAfter: 60 },
          { status: 429 }
        );
        res.headers.set('Retry-After', '60');
        return applySecurityHeaders(res);
      }
    } catch (err) {
      console.error('Redis rate limit error:', err);
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)',
  ],
};
