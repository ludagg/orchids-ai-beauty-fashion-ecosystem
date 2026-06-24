import { describe, it, expect } from 'vitest';
import rateLimit from './rate-limit';

describe('rateLimit', () => {

  it('allows requests within limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });

    // Should pass limit of 3
    await expect(limiter.check(3, 'token1')).resolves.toBeUndefined();
    await expect(limiter.check(3, 'token1')).resolves.toBeUndefined();
  });

  it('rejects requests exceeding limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });

    // Setup limit of 2
    await expect(limiter.check(2, 'token2')).resolves.toBeUndefined(); // Usage 1

    // Exceeds limit
    await expect(limiter.check(2, 'token2')).rejects.toBeUndefined(); // Usage 2
  });

  it('uses separate counters for different tokens', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });

    // Token A reaches limit
    await limiter.check(2, 'tokenA');
    await expect(limiter.check(2, 'tokenA')).rejects.toBeUndefined();

    // Token B should still be allowed
    await expect(limiter.check(2, 'tokenB')).resolves.toBeUndefined();
  });

  it('expires tokens after interval', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 100 }); // very short interval

    await limiter.check(2, 'token3');
    await expect(limiter.check(2, 'token3')).rejects.toBeUndefined();

    // Wait for real time to pass
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Limit should be reset for token
    await expect(limiter.check(2, 'token3')).resolves.toBeUndefined();
  });
});
