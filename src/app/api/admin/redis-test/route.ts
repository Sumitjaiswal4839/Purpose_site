import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  if (!redis) {
    return NextResponse.json(
      { 
        status: 'disabled', 
        message: 'Upstash Redis environment variables (UPSTASH_REDIS_REST_URL/TOKEN) are not configured.' 
      },
      { status: 400 }
    );
  }

  try {
    // Perform a lightweight test command (e.g., ping or checking connection)
    const start = Date.now();
    const pong = await redis.ping();
    const latency = Date.now() - start;

    return NextResponse.json({
      status: 'connected',
      response: pong,
      latencyMs: latency,
      provider: 'Upstash Redis',
    });
  } catch (error: any) {
    console.error('Redis connection test failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to Redis', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
