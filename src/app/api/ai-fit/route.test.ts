import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
const { mDb } = vi.hoisted(() => ({
    mDb: {
        query: {
            users: { findFirst: vi.fn() },
            products: { findFirst: vi.fn() }
        }
    }
}));

vi.mock('@/lib/db', () => ({ db: mDb }));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn().mockResolvedValue({ user: { id: 'user-1' } })
        }
    }
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

// Mock GoogleGenerativeAI
const { mGenerateContent, mGetGenerativeModel } = vi.hoisted(() => {
    const mGenerateContent = vi.fn();
    return {
        mGenerateContent,
        mGetGenerativeModel: vi.fn().mockReturnValue({ generateContent: mGenerateContent })
    };
});

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: class {
        getGenerativeModel = mGetGenerativeModel;
    }
}));

describe('AI Fit Check API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-key';
    });

    test('should return 400 if product ID is missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', weight: '75' })
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Product ID is required');
    });

    test('should return 400 if height and weight are missing', async () => {
        mDb.query.users.findFirst.mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod-1' })
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Height and weight are required for AI Fit Check');
    });

    test('should use heuristic fallback if GEMINI_API_KEY is not set', async () => {
        delete process.env.GEMINI_API_KEY;

        mDb.query.users.findFirst.mockResolvedValueOnce({ height: '180', weight: '75', bodyType: 'athletic' });
        mDb.query.products.findFirst.mockResolvedValueOnce({
            id: 'prod-1',
            name: 'T-Shirt',
            sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
        });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod-1' })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        // Expected heuristic for 180cm/75kg is M or L depending on exact boundaries.
        // The fallback function says L if height > 175 or weight > 75
        expect(data.recommendedSize).toBeDefined();
        expect(data.explanation).toBeDefined();
        expect(data.confidence).toBe(0.7);
        expect(mGenerateContent).not.toHaveBeenCalled();
    });

    test('should use Gemini API if available', async () => {
        mDb.query.users.findFirst.mockResolvedValueOnce(null);
        mDb.query.products.findFirst.mockResolvedValueOnce({
            id: 'prod-1',
            name: 'Dress',
            brand: 'Zara',
            description: 'A nice slim fit dress.',
            sizes: [{ name: 'S' }, { name: 'M' }]
        });

        mGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => JSON.stringify({
                    recommendedSize: 'S',
                    explanation: 'AI explanation here.',
                    confidence: 0.9
                })
            }
        });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'prod-1', height: '160', weight: '55', bodyType: 'slim' })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        expect(mGenerateContent).toHaveBeenCalled();
        expect(data.recommendedSize).toBe('S');
        expect(data.explanation).toBe('AI explanation here.');
        expect(data.confidence).toBe(0.9);
    });
});
