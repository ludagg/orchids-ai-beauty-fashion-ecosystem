import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// Mock auth
vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn()
        }
    }
}));

// Mock Next headers
vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

// Mock DB
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();

vi.mock('@/lib/db', () => ({
    db: {
        select: () => ({
            from: () => ({
                where: () => ({
                    limit: mockLimit
                })
            })
        })
    }
}));

// Mock Gemini
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: vi.fn().mockResolvedValue({
                        response: {
                            text: () => JSON.stringify({
                                recommendedSize: "M",
                                confidence: 85,
                                explanation: "Mock AI Explanation",
                                fitDetails: "Mock Fit Details"
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
        process.env.GEMINI_API_KEY = 'mock-key';
    });

    test('should return 400 if productId is missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({})
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('productId is required');
    });

    test('should return 401 if unauthorized', async () => {
        (auth.api.getSession as any).mockResolvedValue(null);
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod_1' })
        });
        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    test('should return 400 if user profile is incomplete', async () => {
        (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user_1' } });
        mockLimit.mockResolvedValueOnce([{ id: 'user_1' }]); // Mock user response (no stats)

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod_1' })
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Profile incomplete');
    });

    test('should return 404 if product not found', async () => {
        (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user_1' } });
        mockLimit
            .mockResolvedValueOnce([{ id: 'user_1', weight: '70kg' }]) // Mock user
            .mockResolvedValueOnce([]); // Mock product (not found)

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod_1' })
        });
        const res = await POST(req);
        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toBe('Product not found');
    });

    test('should return AI recommendation on success', async () => {
        (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user_1' } });
        mockLimit
            .mockResolvedValueOnce([{ id: 'user_1', weight: '70kg' }]) // Mock user
            .mockResolvedValueOnce([{ id: 'prod_1', name: 'Cool Shirt' }]); // Mock product

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod_1' })
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.recommendedSize).toBe('M');
        expect(data.confidence).toBe(85);
        expect(data.explanation).toBe('Mock AI Explanation');
    });

    test('should fallback if GEMINI_API_KEY is not set', async () => {
        delete process.env.GEMINI_API_KEY;
        (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user_1' } });
        mockLimit
            .mockResolvedValueOnce([{ id: 'user_1', weight: '70kg' }]) // Mock user
            .mockResolvedValueOnce([{ id: 'prod_1', name: 'Cool Shirt' }]); // Mock product

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod_1' })
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.recommendedSize).toBe('M'); // 70kg falls into 'M' in fallback logic
        expect(data.confidence).toBe(70);
    });
});
