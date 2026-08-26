import { NextResponse, NextRequest } from 'next/server';

/**
 * middleware.ts — Next.js Edge Middleware
 *
 * Applies rate limiting + security headers to all API routes.
 * Lives at project root so Next.js automatically picks it up.
 *
 * Fixes applied:
 * - Issue #6:  Rate limiting now actually RUNS (proxy.ts was never wired before)
 * - Issue #25: Admin auth, payment verify, and brute-force targets get tight limits
 */

// ── In-memory sliding window rate limiter ─────────────────────────────────────
interface RateLimitEntry {
  timestamps: number[];
}
const store = new Map<string, RateLimitEntry>();

let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  const cutoff = now - 60_000;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

function isRateLimited(ip: string, routeKey: string, maxRequests: number): boolean {
  maybeCleanup();
  const key = `${ip}:${routeKey}`;
  const now = Date.now();
  const windowMs = 60_000;

  const entry = store.get(key) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => t > now - windowMs);

  if (entry.timestamps.length >= maxRequests) {
    store.set(key, entry);
    return true;
  }
  entry.timestamps.push(now);
  store.set(key, entry);
  return false;
}

// ── Per-route rate limits ─────────────────────────────────────────────────────
// Issue #25 fix: admin auth + payment endpoints get very tight limits
function getLimit(pathname: string, method: string): number {
  // Critical: admin login brute-force protection — 5 attempts/min/IP
  if (pathname === '/api/admin/auth')             return 5;

  // Payment verification — tight to prevent replay/enumeration attacks
  if (pathname === '/api/payment/verify')         return 5;
  if (pathname === '/api/payment/verify-manual')  return 10;
  if (pathname === '/api/payment/create-order')   return 10;

  // User form submissions — prevent spam
  if (pathname === '/api/proposals/save')         return 3;
  if (pathname === '/api/custom-requests' && method === 'POST') return 5;

  // Notification — prevent email spam abuse
  if (pathname === '/api/notify')                 return 10;

  // Image uploads — prevent storage abuse
  if (pathname === '/api/upload/image')           return 10;

  // All other POSTs
  if (method === 'POST')                          return 20;

  // GETs — generous but not unlimited
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

// ── Main middleware ───────────────────────────────────────────────────────────
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const limit = getLimit(pathname, req.method);

    if (isRateLimited(ip, `${req.method}:${pathname}`, limit)) {
      const res = NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.', retryAfter: 60 },
        { status: 429 }
      );
      res.headers.set('Retry-After', '60');
      return applySecurityHeaders(res);
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    // Apply to all routes except static files and images
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)',
  ],
};
