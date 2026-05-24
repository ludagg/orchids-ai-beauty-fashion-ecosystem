import { expect, test, describe, mock, beforeEach } from "bun:test";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock the db
mock.module("@/lib/db", () => {
  return {
    db: {
      query: {
        products: {
          findMany: mock(async () => [
            { id: "1", name: "Red Dress", category: "dress", rating: 5, isActive: true },
          ]),
        },
      },
    },
  };
});

describe("AI Stylist API Route", () => {
  beforeEach(() => {
    // Clear mock between tests if needed
  });

  test("should handle missing message with 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai-stylist/chat", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Message is required");
  });

  test("should use fallback keyword matching if GEMINI_API_KEY is not set", async () => {
    const originalEnv = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = ""; // Ensure it's unset

    const req = new NextRequest("http://localhost:3000/api/ai-stylist/chat", {
      method: "POST",
      body: JSON.stringify({ message: "I want a red dress" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    // Based on fallback logic, it should find something and return products
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.message).toContain("I found some lovely red dress options for you! Have a look:");

    process.env.GEMINI_API_KEY = originalEnv;
  });
});
