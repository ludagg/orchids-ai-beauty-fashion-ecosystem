// [Jules - Unit test for crypto functions]
import { expect, test } from "bun:test";
import { verifyWebhookSignature } from "./crypto";
import crypto from "crypto";

test("verifyWebhookSignature should validate correct signatures", () => {
    const body = "test_payload";
    const secret = "test_secret";
    const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");

    expect(verifyWebhookSignature(signature, body, secret)).toBe(true);
});

test("verifyWebhookSignature should reject wrong signatures", () => {
    const body = "test_payload";
    const secret = "test_secret";

    expect(verifyWebhookSignature("wrong_signature", body, secret)).toBe(false);
});

test("verifyWebhookSignature should handle undefined or null inputs", () => {
    const body = "test_payload";
    const secret = "test_secret";

    expect(verifyWebhookSignature(undefined, body, secret)).toBe(false);
    expect(verifyWebhookSignature(null, body, secret)).toBe(false);
    expect(verifyWebhookSignature("sig", body, undefined)).toBe(false);
});
