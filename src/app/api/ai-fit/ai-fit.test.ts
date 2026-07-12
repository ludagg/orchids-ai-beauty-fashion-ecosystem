import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: vi.fn().mockResolvedValue({
                        response: {
                            text: () => JSON.stringify({
                                size: "L",
                                fit: "regular",
                                confidence: 85,
                                explanation: "Mocked AI explanation"
                            })
                        }
                    })
                };
            }
        }
    };
});

describe('POST /api/ai-fit', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        process.env.GEMINI_API_KEY = 'test-api-key';
    });

    it('should return 400 if required fields are missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                height: "180"
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(400);

        const data = await res.json();
        expect(data.error).toBe("Missing required fields");
    });

    it('should use the fallback heuristic if GEMINI_API_KEY is not set or dummy', async () => {
        process.env.GEMINI_API_KEY = 'dummy-gemini-key';

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                height: "175",
                weight: "65",
                bodyType: "slim",
                product: { name: "Test Shirt" },
                sizes: [{ name: "S" }, { name: "M" }, { name: "L" }]
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.size).toBeDefined();
        expect(data.fit).toBeDefined();
        expect(data.confidence).toBe(70);
    });

    it('should use GoogleGenerativeAI and return parsed JSON size recommendation', async () => {
        process.env.GEMINI_API_KEY = 'real-test-key';

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                height: "185",
                weight: "80",
                bodyType: "athletic",
                product: { name: "Test Shirt", description: "Nice shirt" },
                sizes: [{ name: "S" }, { name: "M" }, { name: "L" }, { name: "XL" }]
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.size).toBe("L");
        expect(data.fit).toBe("regular");
        expect(data.confidence).toBe(85);
        expect(data.explanation).toBe("Mocked AI explanation");
    });
});
