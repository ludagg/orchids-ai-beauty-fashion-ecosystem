import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock Next.js headers
vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

// Mock Auth
const mockGetSession = vi.fn();
vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: (...args: any[]) => mockGetSession(...args)
        }
    }
}));

// Mock Generative AI Class structure
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: mockGenerateContent
                };
            }
        }
    };
});

describe('POST /api/ai-fit', () => {
    const defaultProduct = {
        name: "Test Shirt",
        brand: "Zara",
        description: "Cool shirt",
        sizes: [{ name: "S" }, { name: "M" }, { name: "L" }]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test_key';
    });

    test('returns 401 if unauthorized', async () => {
        mockGetSession.mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productData: defaultProduct })
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    test('returns 400 if product data is missing', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({})
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    test('uses fallback if API key is missing', async () => {
        process.env.GEMINI_API_KEY = '';
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                productData: defaultProduct,
                measurements: { height: 170, weight: 65, bodyType: 'average' }
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        // Since weight is 65 (between 60 and 85), naive sizing says M.
        // Zara runs small, so M -> L.
        expect(data.recommendedSize).toBe('L');
        expect(data.confidence).toBe('medium');
    });

    test('uses AI if API key is present', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });

        const aiResponseJSON = {
            recommendation: "Perfect fit",
            explanation: "Because science",
            confidence: "high",
            recommendedSize: "S",
            fitPrediction: "regular"
        };

        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => `\`\`\`json\n${JSON.stringify(aiResponseJSON)}\n\`\`\``
            }
        });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                productData: defaultProduct,
                measurements: { height: 170, weight: 65, bodyType: 'average' }
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.recommendedSize).toBe('S');
        expect(data.confidence).toBe('high');
    });
});