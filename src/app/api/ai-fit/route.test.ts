import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Mock DB
const mockDbFindFirst = vi.fn();
vi.mock('@/lib/db', () => ({
    db: {
        query: {
            products: {
                findFirst: (...args: any[]) => mockDbFindFirst(...args)
            }
        }
    }
}));

vi.mock('@/db/schema', () => ({
    products: { id: 'product-id-col' }
}));

vi.mock('drizzle-orm', () => ({
    eq: vi.fn()
}));

// Mock Generative AI
const { mockGenerateContent } = vi.hoisted(() => ({
    mockGenerateContent: vi.fn()
}));

vi.mock('@google/generative-ai', () => {
    class MockClass {
        getGenerativeModel() {
            return {
                generateContent: (...args: any[]) => mockGenerateContent(...args)
            };
        }
    }
    return { GoogleGenerativeAI: MockClass };
});

describe('POST /api/ai-fit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'fake-key';
    });

    it('returns 400 if productId is missing', async () => {
        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180cm', weight: '75kg' })
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Product ID is required');
    });

    it('returns 404 if product is not found', async () => {
        mockDbFindFirst.mockResolvedValueOnce(null);

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: '123', height: '180cm' })
        });
        const res = await POST(req);
        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toBe('Product not found');
    });

    it('returns AI recommendation successfully', async () => {
        mockDbFindFirst.mockResolvedValueOnce({
            id: '123',
            name: 'Test Shirt',
            brand: 'Test Brand',
            mainCategory: 'Clothing',
            subcategory: 'Shirts',
            description: 'A nice shirt'
        });

        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => JSON.stringify({
                    recommendedSize: 'L',
                    explanation: 'L fits well for 180cm.',
                    confidenceScore: 85
                })
            }
        });

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: '123', height: '180cm', weight: '75kg' })
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        expect(data.recommendedSize).toBe('L');
        expect(data.explanation).toContain('L fits well');
    });

    it('falls back to local heuristic if AI fails or key is missing', async () => {
        mockDbFindFirst.mockResolvedValueOnce({
            id: '123',
            name: 'Test Shirt',
            brand: 'Test Brand',
            mainCategory: 'Clothing',
            subcategory: 'Shirts',
            description: 'A nice shirt'
        });

        // Force AI to fail
        mockGenerateContent.mockRejectedValueOnce(new Error('AI failed'));

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: '123', height: '180cm', weight: '75kg' })
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        // BMI heuristic: 75 / (1.8^2) = ~23 -> 'M'
        expect(data.recommendedSize).toBe('M');
        expect(data.explanation).toContain('heuristic estimation');
    });
});
