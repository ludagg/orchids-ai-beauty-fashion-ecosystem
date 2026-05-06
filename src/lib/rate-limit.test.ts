import { test, expect, describe } from "bun:test";
import rateLimit from "./rate-limit";

describe("rateLimit", () => {
    test("should allow requests under the limit", async () => {
        const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });

        // When limit is 5, requests 1 to 4 should pass, request 5 will fail (currentUsage=5 >= 5)
        await expect(limiter.check(5, "token1")).resolves.toBeUndefined(); // count = 1
        await expect(limiter.check(5, "token1")).resolves.toBeUndefined(); // count = 2
        await expect(limiter.check(5, "token1")).resolves.toBeUndefined(); // count = 3
        await expect(limiter.check(5, "token1")).resolves.toBeUndefined(); // count = 4
    });

    test("should reject requests over or equal to the limit", async () => {
        const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });

        await expect(limiter.check(3, "token2")).resolves.toBeUndefined(); // count = 1
        await expect(limiter.check(3, "token2")).resolves.toBeUndefined(); // count = 2
        await expect(limiter.check(3, "token2")).rejects.toBeUndefined(); // count = 3 >= 3 -> reject
        await expect(limiter.check(3, "token2")).rejects.toBeUndefined(); // count = 4 >= 3 -> reject
    });

    test("should track different tokens independently", async () => {
        const limiter = rateLimit({ uniqueTokenPerInterval: 10, interval: 60000 });

        await expect(limiter.check(2, "token3")).resolves.toBeUndefined(); // count = 1
        await expect(limiter.check(2, "token3")).rejects.toBeUndefined();  // count = 2 -> reject

        await expect(limiter.check(2, "token4")).resolves.toBeUndefined(); // token4 count = 1
        await expect(limiter.check(2, "token4")).rejects.toBeUndefined();  // token4 count = 2 -> reject
    });
});
