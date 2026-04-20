import { describe, expect, it, mock } from "bun:test";

mock.module("@/lib/db", () => ({
  db: {
    query: {
      products: {
        findMany: mock(() => Promise.resolve([
          { id: "prod_1", name: "Red Dress", rating: 5, isActive: true },
        ])),
      },
    },
  },
}));

mock.module("@google/generative-ai", () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: mock(() => Promise.resolve({
          response: {
            text: () => JSON.stringify({
              reply: "Here is your red dress!",
              searchCriteria: {
                category: ["dress"],
                color: ["red"],
                occasion: [],
                keywords: []
              }
            })
          }
        }))
      };
    }
  }
}));

import { POST } from "./route";
import { NextRequest } from "next/server";

describe("AI Stylist API - POST", () => {
  it("should return keyword match when GEMINI_API_KEY is missing", async () => {
    // Temporarily unset GEMINI_API_KEY
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const payload = { message: "I want a red dress for a party" };
    const req = new NextRequest("http://localhost/api/ai-stylist/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    // We expect the fallback message and the mocked db product
    expect(json.products).toHaveLength(1);
    expect(json.products[0].name).toBe("Red Dress");

    // Restore key
    if (originalKey) {
        process.env.GEMINI_API_KEY = originalKey;
    }
  });

  it("should use Gemini AI when key is present", async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = "test_key";

    const payload = { message: "I want a red dress for a party" };
    const req = new NextRequest("http://localhost/api/ai-stylist/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    // Check if the reply comes from the mock Gemini model
    expect(json.message).toBe("Here is your red dress!");
    expect(json.products).toHaveLength(1);
    expect(json.products[0].name).toBe("Red Dress");

    // Restore key
    if (originalKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });
});
