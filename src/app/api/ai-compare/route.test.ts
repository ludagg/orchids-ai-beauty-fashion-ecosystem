import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as comparePost } from './route';

const { mockGenerateContent } = vi.hoisted(() => ({
    mockGenerateContent: vi.fn()
}));

vi.mock('@google/generative-ai', () => {
    class MockGoogleGenerativeAI {
        getGenerativeModel() {
            return {
                generateContent: mockGenerateContent
            };
        }
    }
    return { GoogleGenerativeAI: MockGoogleGenerativeAI };
});

describe('AI Compare API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test_key';
    });

    it('returns 400 if less than two items provided', async () => {
        const req = new Request('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({ items: [{ name: 'Item 1' }] })
        });
        const res = await comparePost(req);
        expect(res.status).toBe(400);
    });

    it('uses fallback algorithm if AI fails', async () => {
        mockGenerateContent.mockRejectedValue(new Error('AI failed'));

        const req = new Request('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({
                items: [
                    { name: 'Cheap Item', price: 1000, rating: 3 },
                    { name: 'Good Item', price: 5000, rating: 5 }
                ]
            })
        });

        const res = await comparePost(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.comparison).toContain('(Fallback)');
        expect(data.recommendation).toContain('Good Item');
    });

    it('parses AI JSON response correctly', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => '```json\n{ "comparison": "AI Compare", "recommendation": "Item 1", "features": {} }\n```'
            }
        });

        const req = new Request('http://localhost/api/ai-compare', {
            method: 'POST',
            body: JSON.stringify({
                items: [
                    { name: 'Item 1', price: 1000 },
                    { name: 'Item 2', price: 2000 }
                ]
            })
        });

        const res = await comparePost(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.comparison).toBe('AI Compare');
        expect(data.recommendation).toBe('Item 1');
    });
});
