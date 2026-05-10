import { expect, test, describe } from 'bun:test';
import rateLimit from './rate-limit';

describe('rateLimit utility', () => {
  test('should allow requests below the limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });
    const token = 'test-token-1';

    // First request should resolve
    await expect(limiter.check(2, token)).resolves.toBeUndefined();
  });

  test('should reject requests exceeding the limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });
    const token = 'test-token-2';

    // First request (limit 2, usage 1) - ok
    await expect(limiter.check(2, token)).resolves.toBeUndefined();

    // Second request (limit 2, usage 2) - ok
    await expect(limiter.check(2, token)).resolves.toBeUndefined();

    // Third request (limit 2, usage 3) - should be rate limited and reject
    await expect(limiter.check(2, token)).rejects.toBeUndefined();
  });

  test('should track different tokens separately', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });

    // Limit is 1
    await expect(limiter.check(1, 'token-a')).resolves.toBeUndefined();
    await expect(limiter.check(1, 'token-a')).rejects.toBeUndefined();

    // token-b should still be allowed once
    await expect(limiter.check(1, 'token-b')).resolves.toBeUndefined();
  });
});
