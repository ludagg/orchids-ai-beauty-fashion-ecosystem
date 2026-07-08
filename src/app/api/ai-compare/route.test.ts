import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock DB via vi.hoisted
const { mTx, mockGenerateContent } = vi.hoisted(() => ({
    mTx: { findMany: vi.fn() },
    mockGenerateContent: vi.fn()
}));

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            products: mTx,
        },
    },
}));

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: mockGenerateContent,
                };
            }
        },
    };
});

describe('POST /api/ai-compare', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-key';
    });

    test('should return 400 if less than 2 itemIds provided', async () => {
        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ itemIds: ['1'] }),
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe("Please provide at least two item IDs to compare");
    });

    test('should return 404 if DB does not return enough products', async () => {
        mTx.findMany.mockResolvedValueOnce([{ id: '1', name: 'Product 1' }]);

        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ itemIds: ['1', '2'] }),
        });

        const res = await POST(req);
        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toBe("Could not find enough valid products to compare");
    });

    test('should use local heuristic if GEMINI_API_KEY is not set', async () => {
        delete process.env.GEMINI_API_KEY;

        const mockProducts = [
            { id: '1', name: 'Product 1', salePrice: 1000, rating: 4.5 },
            { id: '2', name: 'Product 2', originalPrice: 2000, rating: 4.0 },
        ];
        mTx.findMany.mockResolvedValueOnce(mockProducts);

        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ itemIds: ['1', '2'] }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.summary).toBe("Comparing Product 1 and Product 2.");
        expect(data.points[0].title).toBe("Price Difference");
        expect(data.points[0].description).toBe("Product 1 is more affordable.");
        expect(data.points[1].title).toBe("Rating");
        expect(data.points[1].description).toBe("Product 1 has a higher rating (4.5 vs 4.0).");
    });

    test('should use Gemini API and parse JSON response', async () => {
        const mockProducts = [
            { id: '1', name: 'Product 1', salePrice: 1000 },
            { id: '2', name: 'Product 2', salePrice: 2000 },
        ];
        mTx.findMany.mockResolvedValueOnce(mockProducts);

        const mockGeminiResponse = {
            summary: "AI Summary Test",
            points: [{ title: "AI Price", description: "AI Price Analysis" }]
        };

        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => JSON.stringify(mockGeminiResponse)
            }
        });

        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ itemIds: ['1', '2'] }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.summary).toBe("AI Summary Test");
        expect(data.points[0].title).toBe("AI Price");
    });

    test('should fallback to local heuristic if Gemini fails to parse', async () => {
        const mockProducts = [
            { id: '1', name: 'Product 1', salePrice: 1000 },
            { id: '2', name: 'Product 2', salePrice: 2000 },
        ];
        mTx.findMany.mockResolvedValueOnce(mockProducts);

        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => "Invalid JSON string from AI"
            }
        });

        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ itemIds: ['1', '2'] }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        // Since Gemini failed, we expect the local heuristic summary
        expect(data.summary).toBe("Comparing Product 1 and Product 2.");
    });
});
