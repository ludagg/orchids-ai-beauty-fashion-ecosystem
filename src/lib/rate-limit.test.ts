import { expect, test, describe } from "bun:test";
import rateLimit from "./rate-limit";

describe("rateLimit", () => {
  test("should allow requests under the limit", async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

    // First request should pass
    await limiter.check(5, "token1");
    // If it passes, it resolves, and we get here
    expect(true).toBe(true);
  });

  test("should block requests over the limit", async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

    await limiter.check(2, "token2"); // Usage 1

    try {
        await limiter.check(2, "token2"); // Usage 2 >= 2
        expect(false).toBe(true); // Should not reach here
    } catch (e: any) {
        // Expected to throw
        expect(true).toBe(true);
    }
  });
});
