// [Jules - Unit test for Webhook Security Standard]
import { expect, test, mock } from "bun:test";
import { POST } from "./route";
import crypto from "crypto";

// Mock LoyaltyEngine
mock.module("@/lib/loyalty", () => ({
  LoyaltyEngine: {
    addPoints: mock(async () => {}),
  },
}));

test("Webhook should reject requests with invalid signature", async () => {
    const body = JSON.stringify({
        type: "booking.completed",
        userId: "user1",
        data: { bookingId: "b1", amount: 150000 }
    });

    // Using a fake secret for testing
    process.env.WEBHOOK_SECRET = "test_secret";

    // Invalid signature
    const req = new Request("http://localhost/api/loyalty/webhook", {
        method: "POST",
        body,
        headers: {
            "x-signature": "invalid_signature",
        }
    });

    const response = await POST(req as any);
    expect(response.status).toBe(401);
});

test("Webhook should process requests with valid signature and calculate points correctly", async () => {
    const bodyObj = {
        type: "booking.completed",
        userId: "user1",
        data: { bookingId: "b1", amount: 150000 } // 1500 INR -> 150 points
    };
    const body = JSON.stringify(bodyObj);

    process.env.WEBHOOK_SECRET = "test_secret";

    const expectedSignature = crypto
        .createHmac("sha256", "test_secret")
        .update(body)
        .digest("hex");

    const req = new Request("http://localhost/api/loyalty/webhook", {
        method: "POST",
        body,
        headers: {
            "x-signature": expectedSignature,
        }
    });

    const response = await POST(req as any);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.pointsAwarded).toBe(150);
});
