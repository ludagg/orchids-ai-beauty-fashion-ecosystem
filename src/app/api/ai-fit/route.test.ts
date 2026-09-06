import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

const { mockGetGenerativeModel, mockGenerateContent } = vi.hoisted(() => {
    const mockGenerateContent = vi.fn();
    const mockGetGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent
    });
    return { mockGetGenerativeModel, mockGenerateContent };
});

vi.mock('@google/generative-ai', () => {
    class MockClass {
        constructor() {}
        getGenerativeModel = mockGetGenerativeModel
    }
    return { GoogleGenerativeAI: MockClass };
});

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Map())
}));

const mockDbQueryFirst = vi.fn();

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            users: {
                findFirst: vi.fn((...args) => mockDbQueryFirst('users', ...args))
            },
            products: {
                findFirst: vi.fn((...args) => mockDbQueryFirst('products', ...args))
            }
        }
    }
}));

const mockGetSession = vi.fn();

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: (...args: any[]) => mockGetSession(...args)
        }
    }
}));

describe('POST /api/ai-fit/route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-key';
    });

    it('returns 401 if unauthorized', async () => {
        mockGetSession.mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'p1' })
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    it('returns 404 if product not found', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });
        mockDbQueryFirst.mockImplementation((table) => {
            if (table === 'users') return Promise.resolve({ id: 'u1' });
            if (table === 'products') return Promise.resolve(null);
        });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'p1' })
        });

        const res = await POST(req);
        expect(res.status).toBe(404);
    });

    it('returns Missing Data if user lacks measurements', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });
        mockDbQueryFirst.mockImplementation((table) => {
            if (table === 'users') return Promise.resolve({ id: 'u1' }); // No height/weight
            if (table === 'products') return Promise.resolve({ id: 'p1', name: 'Shirt', sizes: [{ name: 'M' }] });
        });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'p1' })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.recommendation).toBe("Missing Data");
    });

    it('uses Gemini to provide recommendation when data is present', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });
        mockDbQueryFirst.mockImplementation((table) => {
            if (table === 'users') return Promise.resolve({ id: 'u1', height: '180cm', weight: '75kg', bodyType: 'athletic' });
            if (table === 'products') return Promise.resolve({ id: 'p1', name: 'Shirt', brand: 'Nike', sizes: [{ name: 'S' }, { name: 'M' }] });
        });

        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => '```json\n{"recommendation": "M", "confidence": 90, "analysis": "Based on athletic build."}\n```'
            }
        });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'p1' })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.recommendation).toBe("M");
        expect(data.confidence).toBe(90);
    });
});
