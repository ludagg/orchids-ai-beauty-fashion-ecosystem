import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

const { MockGoogleGenerativeAI } = vi.hoisted(() => {
    const mockGenerativeModel = {
        generateContent: vi.fn().mockResolvedValue({
            response: {
                text: () => JSON.stringify({
                    recommendedSize: "M",
                    fitType: "perfect",
                    reasoning: "Based on AI analysis, this fits perfectly.",
                    confidence: "High"
                })
            }
        })
    };

    class MockClass {
        getGenerativeModel() {
            return mockGenerativeModel;
        }
    }

    return { MockGoogleGenerativeAI: MockClass };
});

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: MockGoogleGenerativeAI
}));

describe('POST /api/ai-fit', () => {
    it('returns an error if measurements are missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                productId: '1',
                productName: 'T-Shirt',
            })
        });

        const response = await POST(req);
        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data.error).toBe("Missing measurements");
    });

    it('returns AI recommendation when given valid input', async () => {
        process.env.GEMINI_API_KEY = "dummy-key";

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                productId: '1',
                productName: 'T-Shirt',
                height: "175",
                weight: "70",
                bodyType: "average"
            })
        });

        const response = await POST(req);
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.recommendedSize).toBe("M");
        expect(data.fitType).toBe("perfect");
        expect(data.confidence).toBe("High");
    });

    it('returns fallback recommendation when GEMINI_API_KEY is not set', async () => {
        delete process.env.GEMINI_API_KEY;

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                productId: '1',
                productName: 'T-Shirt',
                height: "190",
                weight: "95",
                bodyType: "average"
            })
        });

        const response = await POST(req);
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.recommendedSize).toBe("XL");
        expect(data.fitType).toBe("perfect");
        expect(data.confidence).toBe("Medium");
    });
});
