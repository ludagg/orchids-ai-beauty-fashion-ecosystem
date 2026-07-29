import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

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
    };
});

describe('POST /api/ai-fit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'dummy-gemini-key';
    });

    const mockProduct = {
        name: 'Cool T-Shirt',
        mainCategory: 'Clothing',
        subcategory: 'T-Shirts',
        description: 'A very cool t-shirt',
    };

    const mockMeasurements = {
        height: '175',
        weight: '65',
        bodyType: 'athletic'
    };

    it('should return heuristic fallback when GEMINI_API_KEY is missing or dummy', async () => {
        process.env.GEMINI_API_KEY = 'dummy-gemini-key';

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ product: mockProduct, measurements: mockMeasurements })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toHaveProperty('size');
        expect(data).toHaveProperty('confidence');
        expect(data).toHaveProperty('reasoning');
        expect(data).toHaveProperty('fitEstimate');
        // BMI = 65 / (1.75*1.75) = 21.2 (Normal) -> Base size M. But athletic -> L
        expect(data.size).toBe('L');
    });

    it('should call Gemini API when a valid API key is present', async () => {
        process.env.GEMINI_API_KEY = 'valid-key';

        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => JSON.stringify({
                    size: "S",
                    confidence: 90,
                    reasoning: "Gemini reasoning",
                    fitEstimate: "Ajusté"
                })
            }
        });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ product: mockProduct, measurements: mockMeasurements })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.size).toBe('S');
        expect(data.reasoning).toBe('Gemini reasoning');
        expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should return 400 if missing product or measurements', async () => {
        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({})
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
    });
});
