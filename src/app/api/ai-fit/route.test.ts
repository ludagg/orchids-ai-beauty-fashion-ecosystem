import { expect, test, describe, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: vi.fn().mockResolvedValue({
                        response: {
                            text: () => JSON.stringify({
                                size: "L",
                                analysis: "Mocked AI analysis",
                                confidence: 90,
                                fitType: "regular"
                            })
                        }
                    })
                };
            }
        }
    };
});

describe('POST /api/ai-fit', () => {
    test('returns 400 if measurements are missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                product: { id: '1', name: 'Test Shirt' }
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Missing measurements');
    });

    test('uses fallback logic if GEMINI_API_KEY is not set', async () => {
        const originalEnv = process.env.GEMINI_API_KEY;
        delete process.env.GEMINI_API_KEY;

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                product: { id: '1', name: 'Test Shirt', brand: 'Zara' },
                userMeasurements: { height: "170", weight: "65", bodyType: "average" }
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.recommendation).toBeDefined();
        expect(data.recommendation.size).toBe('M'); // default in fallback for this range
        expect(data.recommendation.confidence).toBe(85); // Because Zara brand

        process.env.GEMINI_API_KEY = originalEnv;
    });

    test('uses mocked AI response if GEMINI_API_KEY is set', async () => {
        const originalEnv = process.env.GEMINI_API_KEY;
        process.env.GEMINI_API_KEY = 'test_key';

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                product: { id: '1', name: 'Test Shirt', brand: 'Gucci' },
                userMeasurements: { height: "185", weight: "90", bodyType: "athletic" }
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.recommendation).toBeDefined();
        expect(data.recommendation.size).toBe('L'); // From mock
        expect(data.recommendation.analysis).toBe('Mocked AI analysis');

        process.env.GEMINI_API_KEY = originalEnv;
    });
});