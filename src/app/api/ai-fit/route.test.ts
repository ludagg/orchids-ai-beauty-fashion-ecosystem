import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

const { MockGoogleGenerativeAI } = vi.hoisted(() => {
    class MockClass {
        getGenerativeModel() {
            return {
                generateContent: vi.fn().mockResolvedValue({
                    response: {
                        text: () => JSON.stringify({
                            recommendedSize: 'L',
                            fitDescription: 'A comfortable fit for your profile.',
                            confidenceScore: 90
                        })
                    }
                })
            }
        }
    }
    return { MockGoogleGenerativeAI: MockClass };
});

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: MockGoogleGenerativeAI
}));

describe('POST /api/ai-fit', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv };
    });

    it('returns 400 if product information is missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', weight: '80' })
        });
        const res = await POST(req);
        const data = await res.json();
        expect(res.status).toBe(400);
        expect(data.error).toBe('Product information is required');
    });

    it('uses fallback algorithm when API key is missing', async () => {
        delete process.env.GEMINI_API_KEY;
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                height: '180', weight: '80', bodyType: 'athletic',
                product: { name: 'Jacket', category: 'coat' }
            })
        });
        const res = await POST(req);
        const data = await res.json();

        expect(data.source).toBe('local-fallback');
        expect(data.recommendedSize).toBeDefined();
        // Since BMI for 180cm, 80kg is ~24.7 (normal weight), it should recommend M
        expect(data.recommendedSize).toBe('M');
    });

    it('uses Gemini when API key is present', async () => {
        process.env.GEMINI_API_KEY = 'test-key';
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                height: '180', weight: '80', bodyType: 'athletic',
                product: { name: 'Jacket', category: 'coat' }
            })
        });
        const res = await POST(req);
        const data = await res.json();

        expect(data.source).toBe('gemini');
        expect(data.recommendedSize).toBe('L');
        expect(data.confidenceScore).toBe(90);
    });
});
