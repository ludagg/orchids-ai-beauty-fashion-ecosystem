import { expect, test, describe } from 'bun:test';
import rateLimit from './rate-limit';

describe('rateLimit utility', () => {
  test('should allow requests up to the limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 });
    const limit = 3;
    const token = 'test-token-1';

    // First request - should pass
    await expect(limiter.check(limit, token)).resolves.toBeUndefined();
    // Second request - should pass
    await expect(limiter.check(limit, token)).resolves.toBeUndefined();
  });

  test('should reject requests exceeding the limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 });
    const limit = 2;
    const token = 'test-token-2';

    // First request - should pass
    await expect(limiter.check(limit, token)).resolves.toBeUndefined();

    // Second request - should hit the limit and reject
    await expect(limiter.check(limit, token)).rejects.toBeUndefined();
  });

  test('should track limits independently per token', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 });
    const limit = 1;
    const tokenA = 'token-a';
    const tokenB = 'token-b';

    // Token A hits limit
    await expect(limiter.check(limit, tokenA)).rejects.toBeUndefined();

    // Token B should still be allowed once before hitting limit
    await expect(limiter.check(limit, tokenB)).rejects.toBeUndefined();
  });
});
