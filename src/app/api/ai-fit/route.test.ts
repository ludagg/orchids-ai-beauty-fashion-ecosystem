import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// 1. Mock Next.js headers
vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers()),
}));

// 2. Mock Rate Limit
vi.mock('@/lib/rate-limit', () => ({
    default: () => ({
        check: vi.fn().mockResolvedValue(true),
    })
}));

// 3. Mock Better Auth
const mockGetSession = vi.fn();
vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: (...args: any[]) => mockGetSession(...args),
        },
    },
}));

// 4. Mock Drizzle ORM DB
const mockFindFirst = vi.fn();
vi.mock('@/lib/db', () => ({
    db: {
        query: {
            users: {
                findFirst: (...args: any[]) => mockFindFirst(...args),
            },
        },
    },
}));

// Mock schema so we don't break the actual route
vi.mock('@/db/schema/auth', () => ({
    users: { id: 'mocked_id' },
}));

// 5. Mock GoogleGenerativeAI
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: (...args: any[]) => mockGenerateContent(...args),
                };
            }
        },
    };
});

// 6. Create Mock NextRequest inline to avoid hoisting issues
class MockNextRequest extends Request {
    constructor(url: string, init?: RequestInit) {
        super(url, init);
    }
}


describe('POST /api/ai-fit', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should return 401 if unauthorized', async () => {
        mockGetSession.mockResolvedValue(null);

        const req = new MockNextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productDetails: { sizes: [{ name: 'M' }] } }),
        });

        const res = await POST(req as any);
        expect(res.status).toBe(401);
    });

    test('should return 400 if productDetails sizes are missing', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'user123' } });

        const req = new MockNextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productDetails: {} }),
        });

        const res = await POST(req as any);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toContain('Product details with sizes are required');
    });

    test('should return 404 if user profile is not found', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'user123' } });
        mockFindFirst.mockResolvedValue(null);

        const req = new MockNextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productDetails: { sizes: [{ name: 'M' }] } }),
        });

        const res = await POST(req as any);
        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toBe('User profile not found');
    });

    test('should return 400 with profile update request if height/weight are missing', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'user123' } });
        mockFindFirst.mockResolvedValue({ bodyType: 'athletic' }); // Missing height/weight

        const req = new MockNextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productDetails: { sizes: [{ name: 'M' }] } }),
        });

        const res = await POST(req as any);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.requiresProfileUpdate).toBe(true);
    });

    test('should successfully generate and return a recommendation', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'user123' } });
        mockFindFirst.mockResolvedValue({
            height: '180cm',
            weight: '75kg',
            bodyType: 'athletic'
        });

        const mockAIResponse = JSON.stringify({
            recommendedSize: 'M',
            confidence: 'High',
            reason: 'Based on your measurements...'
        });

        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => `\`\`\`json\n${mockAIResponse}\n\`\`\``
            }
        });

        const req = new MockNextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productDetails: { name: 'Jacket', brand: 'Nike', sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }] } }),
        });

        const res = await POST(req as any);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.recommendedSize).toBe('M');
        expect(data.confidence).toBe('High');
        expect(data.reason).toBeDefined();

        // Verify prompt included details
        const callArgs = mockGenerateContent.mock.calls[0][0];
        expect(callArgs).toContain('180cm');
        expect(callArgs).toContain('Nike');
        expect(callArgs).toContain('S, M, L');
    });

    test('should handle AI parsing errors gracefully', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'user123' } });
        mockFindFirst.mockResolvedValue({ height: '180cm', weight: '75kg' });

        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => 'Invalid JSON response from AI'
            }
        });

        const req = new MockNextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productDetails: { sizes: [{ name: 'M' }] } }),
        });

        const res = await POST(req as any);
        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data.error).toBe('Failed to generate valid recommendation');
    });
});
