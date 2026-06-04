import { expect, test, describe, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn()
        }
    }
}));

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            products: {
                findFirst: vi.fn()
            }
        }
    }
}));

const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: class {
        getGenerativeModel() {
            return {
                generateContent: mockGenerateContent
            };
        }
    }
}));

describe('AI Fit Check API Route', () => {
    test('returns 401 if user is not authenticated', async () => {
        const { auth } = await import('@/lib/auth');
        vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod_123' })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toMatch(/Unauthorized/);
    });

    test('returns 400 if product ID is missing', async () => {
        const { auth } = await import('@/lib/auth');
        vi.mocked(auth.api.getSession).mockResolvedValueOnce({
            user: { id: 'user_1', height: '180cm', weight: '75kg', bodyType: 'athletic' }
        } as any);

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({})
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toMatch(/Product ID is required/);
    });

    test('returns 400 if user profile is incomplete', async () => {
        const { auth } = await import('@/lib/auth');
        vi.mocked(auth.api.getSession).mockResolvedValueOnce({
            user: { id: 'user_1', height: '180cm' } // Missing weight and bodyType
        } as any);

        const { db } = await import('@/lib/db');
        vi.mocked(db.query.products.findFirst).mockResolvedValueOnce({
            id: 'prod_123',
            name: 'Test Shirt',
            sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
        } as any);

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod_123' })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toMatch(/Incomplete profile/);
    });

    test('handles Gemini response successfully', async () => {
        process.env.GEMINI_API_KEY = 'mock_api_key';

        const { auth } = await import('@/lib/auth');
        vi.mocked(auth.api.getSession).mockResolvedValueOnce({
            user: { id: 'user_1', height: '180cm', weight: '75kg', bodyType: 'athletic' }
        } as any);

        const { db } = await import('@/lib/db');
        vi.mocked(db.query.products.findFirst).mockResolvedValueOnce({
            id: 'prod_123',
            name: 'Test Shirt',
            mainCategory: 'Clothing',
            subcategory: 'Shirts',
            description: 'A slim fit shirt',
            sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
        } as any);

        const mockResponseData = {
            recommendedSize: 'M',
            confidenceScore: 90,
            reasoning: 'Based on your athletic body type and 180cm height, M will fit perfectly.'
        };

        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => JSON.stringify(mockResponseData)
            }
        });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod_123' })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.recommendedSize).toBe('M');
        expect(data.confidenceScore).toBe(90);
        expect(data.reasoning).toBeDefined();
    });
});