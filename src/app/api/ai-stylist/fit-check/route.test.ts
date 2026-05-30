import { expect, test, describe, vi } from 'vitest';
import { POST } from './route';

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn().mockResolvedValue({ user: { id: 'user_1' } })
        }
    }
}));

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            products: {
                findFirst: vi.fn().mockResolvedValue({
                    id: 'prod_1',
                    name: 'Test Dress',
                    mainCategory: 'Clothing',
                    subcategory: 'Dresses',
                    description: 'A beautiful test dress.'
                })
            }
        }
    }
}));

vi.mock('@/lib/rate-limit', () => ({
    rateLimit: vi.fn().mockResolvedValue(false)
}));

// Mock GoogleGenerativeAI
const mockGenerateContent = vi.fn().mockResolvedValue({
    response: {
        text: () => JSON.stringify({
            recommendedSize: 'M',
            confidenceScore: 90,
            explanation: 'Based on your height and weight.',
            fitType: 'regular'
        })
    }
});

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: mockGenerateContent
                };
            }
        }
    };
});

describe('AI Fit Check API', () => {
    test('returns 400 if required fields are missing', async () => {
        const req = new Request('http://localhost:3000/api/ai-stylist/fit-check', {
            method: 'POST',
            body: JSON.stringify({})
        }) as any;
        Object.defineProperty(req, 'headers', {
             value: new Headers(),
             writable: true
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Missing required fields');
    });

    test('returns AI fit recommendations successfully', async () => {
        // Mock the environment variable for testing
        process.env.GEMINI_API_KEY = 'test_key';

        const req = new Request('http://localhost:3000/api/ai-stylist/fit-check', {
            method: 'POST',
            body: JSON.stringify({
                productId: 'prod_1',
                userProfile: { height: 170, weight: 65 }
            })
        }) as any;
        Object.defineProperty(req, 'headers', {
             value: new Headers(),
             writable: true
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        expect(data.recommendedSize).toBe('M');
        expect(data.confidenceScore).toBe(90);
        expect(data.fitType).toBe('regular');
        expect(mockGenerateContent).toHaveBeenCalled();
    });
});
