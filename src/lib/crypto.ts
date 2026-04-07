// [Jules - Implementing Webhook Security Standard to verify HMAC-SHA256 signatures]
import crypto from "crypto";

export function verifyWebhookSignature(
  signature: string | null | undefined,
  body: string,
  secret: string | undefined
): boolean {
  if (!signature || !secret) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
    const actualBuffer = Buffer.from(signature, "utf-8");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (error) {
    console.error("Error verifying webhook signature", error);
    return false;
  }
}
