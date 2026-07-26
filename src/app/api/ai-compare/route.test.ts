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

describe('POST /api/ai-compare', () => {
    const items = [
        { id: "1", name: "Shirt A", originalPrice: 1000 },
        { id: "2", name: "Shirt B", originalPrice: 2000 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test_key';
    });

    test('returns 401 if unauthorized', async () => {
        mockGetSession.mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ items })
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    test('returns 400 if less than 2 items', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });

        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ items: [items[0]] })
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    test('uses fallback if API key is missing', async () => {
        process.env.GEMINI_API_KEY = '';
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });

        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ items })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        // Since Shirt A (1) is cheaper than Shirt B (2), it should recommend Shirt A based on price.
        expect(data.recommendation).toContain('more affordable');
        expect(data.features[0].name).toBe('Price');
    });

    test('uses AI if API key is present', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });

        const aiResponseJSON = {
            summary: "AI thinks Shirt B is better",
            features: [
                {
                    name: "Quality",
                    item1Value: "Good",
                    item2Value: "Excellent",
                    betterFor: "2"
                }
            ],
            recommendation: "Buy Shirt B",
            winnerId: "2"
        };

        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => `\`\`\`json\n${JSON.stringify(aiResponseJSON)}\n\`\`\``
            }
        });

        const req = new NextRequest('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ items })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.winnerId).toBe("2");
        expect(data.summary).toContain("AI thinks");
    });
});