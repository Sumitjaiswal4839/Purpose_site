import { NextResponse, NextRequest } from 'next/server';

// ── In-memory sliding window rate limiter (Edge-compatible) ──────────────────
interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leaks
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
  const windowMs = 60_000; // 1-minute sliding window

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

// ── Per-route limits ──────────────────────────────────────────────────────────
function getLimit(pathname: string, method: string): number {
  if (method !== 'POST') return 60;
  if (pathname === '/api/custom-requests') return 5;
  if (pathname === '/api/proposals/save')  return 3;
  if (pathname === '/api/notify')          return 10;
  return 30;
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

// ── Main proxy handler ────────────────────────────────────────────────────────
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const limit = getLimit(pathname, req.method);

    if (isRateLimited(ip, `${req.method}:${pathname}`, limit)) {
      const res = NextResponse.json(
        { error: 'Too many requests', retryAfter: 60 },
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
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)',
  ],
};
