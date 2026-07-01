import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';

const { mockGetSession } = vi.hoisted(() => ({
    mockGetSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: mockGetSession
        }
    }
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

const { mockFindFirst } = vi.hoisted(() => ({
    mockFindFirst: vi.fn()
}));

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            products: {
                findFirst: mockFindFirst
            }
        }
    }
}));

const { mockGenerateContent } = vi.hoisted(() => ({
    mockGenerateContent: vi.fn()
}));

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
    let originalEnv: string | undefined;

    beforeEach(() => {
        vi.clearAllMocks();
        // Since genAI is initialized at module level in route.ts, mocking the env var here
        // won't affect it unless we re-import or redefine the logic.
        // For testing the fallback logic (which currently executes since genAI is null when route.ts is evaluated initially in the test environment):
        originalEnv = process.env.GEMINI_API_KEY;
        delete process.env.GEMINI_API_KEY;
    });

    afterEach(() => {
        process.env.GEMINI_API_KEY = originalEnv;
    });

    test('returns 401 if unauthorized', async () => {
        mockGetSession.mockResolvedValue(null);

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({})
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    test('returns 400 if measurements missing', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'u1' } });

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'p1' })
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Measurements are incomplete');
    });

    test('returns recommendation using fallback logic', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
        mockFindFirst.mockResolvedValue({ name: 'Shirt', brand: 'BrandX', mainCategory: 'Top', subcategory: 'T-Shirt' });

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'p1', height: '175', weight: '70', bodyType: 'Slim' })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.recommendedSize).toBe('M');
        expect(data.recommendation).toBe('We recommend size M based on your height and weight for a perfect true-to-size fit.');
    });
});
