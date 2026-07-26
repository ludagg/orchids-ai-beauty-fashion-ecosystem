import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

const { mockAuthSession } = vi.hoisted(() => ({
    mockAuthSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: mockAuthSession,
        },
    },
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: vi.fn().mockResolvedValue({
                        response: {
                            text: () => JSON.stringify({
                                recommendedSize: "L",
                                confidenceScore: 90,
                                analysis: "AI generated analysis."
                            })
                        }
                    })
                };
            }
        }
    };
});

describe('POST /api/ai-fit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test_key';
    });

    it('should return 401 if user is not authenticated', async () => {
        mockAuthSession.mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    it('should return 400 if measurements are missing', async () => {
        mockAuthSession.mockResolvedValueOnce({ user: { id: 'user1' } });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productData: {} }),
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    it('should return AI recommendation when valid data is provided', async () => {
        mockAuthSession.mockResolvedValueOnce({ user: { id: 'user1' } });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                productData: { name: 'Shirt', brand: 'Brand', sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }] },
                measurements: { height: '180', weight: '75' }
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data).toHaveProperty('recommendedSize');
        expect(data).toHaveProperty('confidenceScore');
        expect(data).toHaveProperty('analysis');
    });

    it('should use fallback algorithm when AI key is missing', async () => {
        process.env.GEMINI_API_KEY = '';
        mockAuthSession.mockResolvedValueOnce({ user: { id: 'user1' } });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                productData: { name: 'Shirt', brand: 'Brand', sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }] },
                measurements: { height: '185', weight: '75' }
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.recommendedSize).toBe('L'); // Because height 185 > 180
        expect(data.confidenceScore).toBe(85);
    });
});
