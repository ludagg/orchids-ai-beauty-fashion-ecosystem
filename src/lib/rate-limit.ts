// [Jules - Refactored rateLimit to use a global LRUCache singleton pattern]
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

const globalForRateLimit = globalThis as unknown as {
  tokenCache: LRUCache<string, number[]> | undefined;
};

export default function rateLimit(options?: Options) {
  const tokenCache = globalForRateLimit.tokenCache ?? new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForRateLimit.tokenCache = tokenCache;
  }

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token)) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        return isRateLimited ? reject() : resolve()
      }),
  }
}
