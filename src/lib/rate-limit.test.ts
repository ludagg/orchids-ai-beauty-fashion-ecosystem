import { expect, test, describe, vi, beforeEach } from 'vitest';
import rateLimit from './rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('allows requests within limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 });

    // First request should succeed
    await expect(limiter.check(3, 'token1')).resolves.toBeUndefined();
    // Second request should succeed
    await expect(limiter.check(3, 'token1')).resolves.toBeUndefined();
  });

  test('rejects requests exceeding limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 });

    await expect(limiter.check(2, 'token3')).resolves.toBeUndefined();
    await expect(limiter.check(2, 'token3')).rejects.toBeUndefined();
  });

  test('independent limits for different tokens', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 });

    await expect(limiter.check(2, 'user-A')).resolves.toBeUndefined();
    await expect(limiter.check(2, 'user-B')).resolves.toBeUndefined();

    await expect(limiter.check(2, 'user-A')).rejects.toBeUndefined(); // user-A hits limit
    await expect(limiter.check(2, 'user-B')).rejects.toBeUndefined(); // user-B hits limit
  });
});
