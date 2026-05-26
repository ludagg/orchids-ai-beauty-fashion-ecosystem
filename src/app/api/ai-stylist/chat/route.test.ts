import { expect, test, describe, mock, beforeEach } from "bun:test";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock environment variable
process.env.GEMINI_API_KEY = "dummy-api-key";

// Mock Drizzle DB
mock.module("@/lib/db", () => {
    return {
        db: {
            query: {
                products: {
                    findMany: mock(async ({ where, limit, orderBy }: any) => {
                        // Dummy response for tests
                        return [
                            {
                                id: "prod-1",
                                name: "Red Party Dress",
                                description: "A nice red dress for parties",
                                mainCategory: "Dress",
                                status: "ACTIVE",
                                rating: 4.5,
                            }
                        ];
                    })
                }
            }
        }
    };
});

// Mock Gemini API
mock.module("@google/generative-ai", () => {
    class GoogleGenerativeAI {
        constructor(apiKey: string) {}
        getGenerativeModel() {
            return {
                generateContent: mock(async (prompt: string) => {
                    return {
                        response: {
                            text: () => JSON.stringify({
                                reply: "Here is your red party dress!",
                                searchCriteria: {
                                    category: ["dress"],
                                    color: ["red"],
                                    occasion: ["party"],
                                    keywords: []
                                }
                            })
                        }
                    };
                })
            };
        }
    }
    return { GoogleGenerativeAI };
});

describe("AI Stylist Chat Route", () => {
    beforeEach(() => {
        // Reset process.env if needed, but it's mocked globally above for this module
    });

    test("should return 400 if message is missing", async () => {
        const req = new NextRequest("http://localhost/api/ai-stylist/chat", {
            method: "POST",
            body: JSON.stringify({}),
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe("Message is required");
    });

    test("should process request via Gemini LLM and return products", async () => {
        const req = new NextRequest("http://localhost/api/ai-stylist/chat", {
            method: "POST",
            body: JSON.stringify({ message: "I want a red party dress" }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        expect(data.message).toBe("Here is your red party dress!");
        expect(data.products).toBeInstanceOf(Array);
        expect(data.products.length).toBe(1);
        expect(data.products[0].name).toBe("Red Party Dress");
    });

    test("should fallback to keyword matching when Gemini API key is missing", async () => {
        // Temporarily clear API key
        const originalKey = process.env.GEMINI_API_KEY;
        delete process.env.GEMINI_API_KEY;

        const req = new NextRequest("http://localhost/api/ai-stylist/chat", {
            method: "POST",
            body: JSON.stringify({ message: "I want a red dress for a party" }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        expect(data.message).toContain("I found some lovely");
        expect(data.products).toBeInstanceOf(Array);
        expect(data.products.length).toBe(1);

        // Restore API key
        process.env.GEMINI_API_KEY = originalKey;
    });

    test("should handle Gemini API errors gracefully and fallback", async () => {
        // We override the mock to throw an error
        mock.module("@google/generative-ai", () => {
            class GoogleGenerativeAI {
                constructor() {}
                getGenerativeModel() {
                    return {
                        generateContent: mock(async () => {
                            throw new Error("Gemini API Error");
                        })
                    };
                }
            }
            return { GoogleGenerativeAI };
        });

        const req = new NextRequest("http://localhost/api/ai-stylist/chat", {
            method: "POST",
            body: JSON.stringify({ message: "Show me a blue shirt" }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        // It should fallback to keyword matching and still return something
        expect(data.message).toBeDefined();
        expect(data.products).toBeInstanceOf(Array);
    });
});
