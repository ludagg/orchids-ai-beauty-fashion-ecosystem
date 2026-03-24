import { test, expect, describe, mock, spyOn } from "bun:test";
import { sendEmail } from "./email";

describe("Email Service", () => {
  test("sendEmail should return success mock if RESEND_API_KEY is missing", async () => {
    // [Jules - Reason for modification] Ensuring mock fallback logic works correctly without throwing in development
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    const result = await sendEmail({
      to: "test@example.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });

    expect(result.success).toBe(true);
    expect(result.id).toMatch(/^mock-id-\d+$/);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
