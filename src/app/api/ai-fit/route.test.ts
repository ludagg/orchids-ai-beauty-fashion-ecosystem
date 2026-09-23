import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as fitCheckPost } from './route';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the AI module
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

describe('AI Fit Check API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test_key';
    });

    it('returns 400 if product is missing', async () => {
        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({})
        });
        const res = await fitCheckPost(req);
        expect(res.status).toBe(400);
    });

    it('uses fallback algorithm if AI fails', async () => {
        mockGenerateContent.mockRejectedValue(new Error('AI failed'));

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                product: { name: 'Test Shirt', description: 'A nice shirt' },
                measurements: { height: '185', weight: '70', bodyType: 'Slim' }
            })
        });

        const res = await fitCheckPost(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.recommendedSize).toBe('L'); // Based on height 185
        expect(data.explanation).toContain('(Fallback)');
    });

    it('parses AI JSON response correctly', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => '```json\n{ "recommendedSize": "S", "explanation": "AI generated explanation." }\n```'
            }
        });

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                product: { name: 'Test Shirt' },
                measurements: { height: '160' }
            })
        });

        const res = await fitCheckPost(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.recommendedSize).toBe('S');
        expect(data.explanation).toBe('AI generated explanation.');
    });
});
