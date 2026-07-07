import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock GoogleGenerativeAI
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
    }
});

describe('POST /api/ai-fit', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        const { auth } = await import('@/lib/auth');
        (auth.api.getSession as any).mockResolvedValue({
            user: { id: 'user_123', name: 'Test User' },
        });

        // Default to not returning valid JSON to trigger fallback in basic tests
        mockGenerateContent.mockResolvedValue({
            response: { text: () => 'Invalid format' }
        });

        // Mock the environment variable for Gemini
        process.env.GEMINI_API_KEY = 'test_key_not_dummy';
    });

    test('returns 401 if unauthorized', async () => {
        const { auth } = await import('@/lib/auth');
        (auth.api.getSession as any).mockResolvedValue(null);

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', weight: '75', bodyType: 'Average', productName: 'T-Shirt' }),
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    test('returns 400 if missing user measurements', async () => {
        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', productName: 'T-Shirt' }), // Missing weight and bodyType
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Missing user measurements');
    });

    test('returns 400 if missing product name', async () => {
        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', weight: '75', bodyType: 'Average' }), // Missing productName
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Missing product information');
    });

    test('returns AI recommendation if Gemini succeeds', async () => {
        // Mock a successful Gemini JSON response
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => '```json\n{"size": "L", "reason": "AI says so"}\n```'
            }
        });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', weight: '75', bodyType: 'Average', productName: 'T-Shirt' }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.size).toBe('L');
        expect(data.reason).toBe('AI says so');
        expect(data.provider).toBe('ai');
    });

    test('falls back to local heuristic if Gemini returns invalid format', async () => {
        // Gemini returns garbage
        mockGenerateContent.mockResolvedValue({
            response: { text: () => 'I think size M is good because reasons.' }
        });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', weight: '75', bodyType: 'Average', productName: 'T-Shirt' }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.size).toBeDefined();
        expect(data.reason).toBeDefined();
        expect(data.provider).toBe('fallback');
    });

    test('falls back to local heuristic if Gemini throws', async () => {
        // Gemini throws an error
        mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'));

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', weight: '75', bodyType: 'Average', productName: 'T-Shirt' }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.provider).toBe('fallback');
    });
});
