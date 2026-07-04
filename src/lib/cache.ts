// ── In-memory LRU Cache with TTL ─────────────────────────────────────────────
// Used for caching API responses (e.g. admin stats).
// Falls back gracefully — no external dependencies required.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  lastAccessed: number;
}

const DEFAULT_TTL = 60; // seconds
const MAX_ENTRIES = 500;

class InMemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  private evict(): void {
    if (this.store.size < MAX_ENTRIES) return;
    // Remove the least recently accessed entry
    let oldest: [string, CacheEntry<unknown>] | null = null;
    for (const entry of this.store.entries()) {
      if (!oldest || entry[1].lastAccessed < oldest[1].lastAccessed) {
        oldest = entry;
      }
    }
    if (oldest) this.store.delete(oldest[0]);
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    entry.lastAccessed = Date.now();
    return entry.value;
  }

  set<T>(key: string, value: T, ttlSeconds = DEFAULT_TTL): void {
    this.evict();
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
      lastAccessed: Date.now(),
    });
  }

  del(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

// ── Singleton instance ────────────────────────────────────────────────────────
const globalForCache = global as unknown as { __appCache: InMemoryCache };
const memCache = globalForCache.__appCache ?? new InMemoryCache();
if (process.env.NODE_ENV !== 'production') globalForCache.__appCache = memCache;

// ── Public async interface ────────────────────────────────────────────────────
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    return memCache.get<T>(key);
  },
  async set(key: string, value: unknown, ttlSeconds = DEFAULT_TTL): Promise<void> {
    memCache.set(key, value, ttlSeconds);
  },
  async del(key: string): Promise<void> {
    memCache.del(key);
  },
  async clear(): Promise<void> {
    memCache.clear();
  },
};
