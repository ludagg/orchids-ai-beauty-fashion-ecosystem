import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// We must use hoisting-safe variables for vi.mock
vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn().mockResolvedValue({ user: { id: 'test-user', role: 'user' } })
        }
    }
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

// Provide a mock NextRequest class for vitest environment within the mock factory to avoid hoisting issues
vi.mock('next/server', () => {
    class MockNextRequest {
        private body: any;
        method: string;

        constructor(url: string, init: { method: string, body: string }) {
            this.method = init.method;
            this.body = JSON.parse(init.body);
        }

        json() {
            return Promise.resolve(this.body);
        }
    }

    return {
        NextRequest: MockNextRequest,
        NextResponse: {
            json: (body: any, init?: any) => {
                return {
                    status: init?.status || 200,
                    json: () => Promise.resolve(body)
                };
            }
        }
    };
});

// Import after mocks
import { POST } from './route';
import { NextRequest } from 'next/server';

const originalEnv = process.env;

describe('AI Fit Check API', () => {
    beforeEach(() => {
        process.env = { ...originalEnv, GEMINI_API_KEY: '' }; // Force fallback
        vi.clearAllMocks();
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should return 401 if unauthorized', async () => {
        // dynamic import of mocked module to adjust mock value
        const { auth } = await import('@/lib/auth');
        vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost/api/ai-stylist/fit-check', {
            method: 'POST',
            body: JSON.stringify({}),
        } as any);

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    it('should return 400 if missing required parameters', async () => {
        const req = new NextRequest('http://localhost/api/ai-stylist/fit-check', {
            method: 'POST',
            body: JSON.stringify({ userHeight: 180 }), // Missing other params
        } as any);

        const res = await POST(req);
        expect(res.status).toBe(400);
        const json = await (res as any).json();
        expect(json.error).toBe('Missing required parameters');
    });

    it('should return fallback recommendation when missing API key', async () => {
        const req = new NextRequest('http://localhost/api/ai-stylist/fit-check', {
            method: 'POST',
            body: JSON.stringify({
                userHeight: 175,
                userWeight: 70,
                bodyType: 'athletic',
                fitPreference: 'slim',
                productType: 't-shirt',
                productFit: 'regular'
            }),
        } as any);

        const res = await POST(req);
        expect(res.status).toBe(200);

        const json = await (res as any).json();
        expect(json.fitScore).toBe(85);
        expect(json.sizeSuggestion).toBe('Medium');
        expect(json.recommendation).toContain('175');
        expect(json.recommendation).toContain('athletic');
    });
});
