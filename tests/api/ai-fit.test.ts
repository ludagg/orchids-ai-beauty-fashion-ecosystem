import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/ai-fit/route';

// Mock GoogleGenerativeAI
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: vi.fn().mockImplementation(() => {
            return {
                getGenerativeModel: vi.fn().mockImplementation(() => {
                    return {
                        generateContent: mockGenerateContent
                    }
                })
            }
        })
    }
});

describe('POST /api/ai-fit', () => {
    const defaultProduct = { name: 'Test Shirt', description: 'A nice shirt', categoryId: 'tops' };

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-key';
    });

    it('should return 400 if product data is missing', async () => {
        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ measurements: { height: 180, weight: 75 } })
        });

        const res = await POST(req);
        expect(res.status).toBe(400);

        const data = await res.json();
        expect(data.error).toBe('Product data is required');
    });

    it('should use fallback algorithm if GEMINI_API_KEY is missing', async () => {
        delete process.env.GEMINI_API_KEY;

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                product: defaultProduct,
                measurements: { height: 190, weight: 90, bodyType: 'Athletic' }
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.size).toBe('XL');
        expect(data.confidence).toBe(75);
        expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it('should use GoogleGenerativeAI and parse JSON response', async () => {
        const aiResponse = JSON.stringify({ size: 'M', reasoning: 'AI Reasoning', confidence: 95 });
        mockGenerateContent.mockResolvedValue({
            response: { text: () => `\`\`\`json\n${aiResponse}\n\`\`\`` }
        });

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                product: defaultProduct,
                measurements: { height: 170, weight: 65, bodyType: 'Slim' }
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.size).toBe('M');
        expect(data.reasoning).toBe('AI Reasoning');
        expect(data.confidence).toBe(95);
        expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should fall back if AI throws an error', async () => {
        mockGenerateContent.mockRejectedValue(new Error("AI Failure"));

        const req = new Request('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                product: defaultProduct,
                measurements: { height: 180, weight: 80, bodyType: 'Regular' }
            })
        });

        const res = await POST(req);
        expect(res.status).toBe(200); // Route catches error and returns 200 with fallback

        const data = await res.json();
        expect(data.size).toBe('L');
        expect(data.confidence).toBe(75);
    });
});
