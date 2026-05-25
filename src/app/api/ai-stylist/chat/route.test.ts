import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mocking the db query to return dummy products for specific conditions
mock.module("@/lib/db", () => {
  return {
    db: {
      query: {
        products: {
          findMany: mock(async (args) => {
            // Mock logic based on conditions
            if (args.where) {
               // We simplified the mock for basic verification. Real queries use complex drizzle operators.
               return [{
                   id: "1",
                   name: "Red Party Dress",
                   mainCategory: 'dress',
                   description: "A lovely red dress.",
                   status: 'ACTIVE',
                   visibility: 'PUBLIC',
                   rating: 5,
               }];
            }
            return [];
          }),
        },
      },
    },
  };
});

describe("AI Stylist API POST", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        delete process.env.GEMINI_API_KEY; // Ensure we hit the fallback logic for tests
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("should return an error if message is empty", async () => {
        const req = new NextRequest("http://localhost/api/ai-stylist/chat", {
            method: "POST",
            body: JSON.stringify({ message: "" }),
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe("Message is required");
    });

    it("should use fallback and return a greeting when message is generic", async () => {
        const req = new NextRequest("http://localhost/api/ai-stylist/chat", {
            method: "POST",
            body: JSON.stringify({ message: "hello" }),
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.message).toContain("Hello! I'm your AI Stylist");
    });
});
