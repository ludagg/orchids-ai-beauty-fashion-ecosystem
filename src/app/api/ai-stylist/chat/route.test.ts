import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock DB
const mockFindMany = vi.fn();
vi.mock('@/lib/db', () => ({
    db: {
        query: {
            products: {
                findMany: (...args: any[]) => mockFindMany(...args)
            }
        }
    }
}));

// Mock Google Generative AI
const mockGenerateContent = vi.fn();
vi.mock('@/google/generative-ai', () => ({
    GoogleGenerativeAI: class {
        getGenerativeModel() {
            return {
                generateContent: mockGenerateContent
            };
        }
    }
}));

// Mock NextRequest directly inside the test or simply use a generic Request
class MockNextRequest extends Request {
    constructor(body: any) {
        super('http://localhost/api/ai-stylist/chat', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

describe('AI Stylist API Route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test_key';
    });

    it('should return 400 if message is missing', async () => {
        const req = new MockNextRequest({});
        const res = await POST(req as any);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Message is required");
    });

    it('should use fallback matching if GEMINI_API_KEY is not set', async () => {
        delete process.env.GEMINI_API_KEY;
        mockFindMany.mockResolvedValue([{ id: '1', name: 'Red Dress' }]);

        const req = new MockNextRequest({ message: "I want a red dress" });
        const res = await POST(req as any);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.products).toHaveLength(1);
        expect(json.message).toContain('I found some lovely red dress options for you!');
    });

    it('should fall back if Gemini throws an error', async () => {
        mockGenerateContent.mockRejectedValue(new Error('Gemini Error'));
        mockFindMany.mockResolvedValue([{ id: '2', name: 'Blue Shoes' }]);

        const req = new MockNextRequest({ message: "Show me blue shoes" });
        const res = await POST(req as any);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.products).toHaveLength(1);
    });
});