import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            users: {
                findFirst: vi.fn()
            }
        }
    }
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn()
        }
    }
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: vi.fn().mockResolvedValue({
                        response: {
                            text: () => JSON.stringify({
                                recommendedSize: 'L',
                                confidence: 85,
                                reasoning: 'Gemini size reasoning'
                            })
                        }
                    })
                };
            }
        }
    };
});

describe('AI Fit Check API', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        const dbMock = await import('@/lib/db');
        const authMock = await import('@/lib/auth');

        // Mock user session
        (authMock.auth.api.getSession as any).mockResolvedValue({
            user: { id: 'user1' }
        });

        // Mock DB query
        (dbMock.db.query.users.findFirst as any).mockResolvedValue({
            height: '180',
            weight: '85',
            bodyType: 'Athletic'
        });
    });

    test('should return 401 if unauthorized', async () => {
        const authMock = await import('@/lib/auth');
        (authMock.auth.api.getSession as any).mockResolvedValue(null);

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ product: { name: 'Test' } })
        });
        const res = await POST(req);

        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toBe('Unauthorized');
    });

    test('should return 400 if product is missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({})
        });
        const res = await POST(req);

        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Product is required');
    });

    test('should return recommendation requiring profile update if measurements missing', async () => {
        const dbMock = await import('@/lib/db');
        (dbMock.db.query.users.findFirst as any).mockResolvedValue({
             height: null,
             weight: null,
             bodyType: null
        });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ product: { name: 'Test' } })
        });
        const res = await POST(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.recommendedSize).toBeNull();
        expect(data.confidence).toBe(0);
        expect(data.reasoning).toContain('Please update your profile');
    });

    test('should use Gemini when API key is present', async () => {
        process.env.GEMINI_API_KEY = 'test-key';

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ product: { name: 'Test Shirt' } })
        });
        const res = await POST(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.recommendedSize).toBe('L');
        expect(data.confidence).toBe(85);
        expect(data.reasoning).toBe('Gemini size reasoning');
    });

    test('should use fallback when API key is missing', async () => {
        delete process.env.GEMINI_API_KEY;

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ product: { name: 'Test Shirt' } })
        });
        const res = await POST(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.recommendedSize).toBe('L'); // Because weight > 80 in our mock
        expect(data.confidence).toBe(65);
        expect(data.reasoning).toContain('Based on your height and weight');
    });
});
