import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the generative AI
vi.mock('@google/generative-ai', () => {
    const generateContentMock = vi.fn();
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: generateContentMock
                }
            }
        },
        __generateContentMock: generateContentMock // Expose for tests
    };
});

describe('AI Fit Route', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    it('should return a 400 error if product or sizes are missing', async () => {
        const req = new Request('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: '180', weight: '75', bodyType: 'athletic' })
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Product or sizes not provided');
    });

    it('should use fallback logic if API key is not set', async () => {
        process.env.GEMINI_API_KEY = ''; // Explicitly unset

        const req = new Request('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                height: '185',
                weight: '85',
                bodyType: 'athletic',
                product: {
                    name: 'Test Shirt',
                    sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }]
                }
            })
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.size).toBeDefined();
        // Fallback for >180 height and >80 weight should pick L, XL etc.
        expect(['L', 'XL', 'XXL']).toContain(data.size);
    });

    it('should parse valid JSON response from Gemini', async () => {
        process.env.GEMINI_API_KEY = 'test-key';

        const { __generateContentMock } = await import('@google/generative-ai') as any;
        __generateContentMock.mockResolvedValue({
            response: {
                text: () => '\`\`\`json\n{ "size": "M", "confidence": 95 }\n\`\`\`'
            }
        });

        const req = new Request('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                height: '175',
                weight: '70',
                bodyType: 'average',
                product: {
                    name: 'Test Shirt',
                    sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
                }
            })
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.size).toBe('M');
        expect(data.confidence).toBe(95);
    });

    it('should fall back if Gemini returns invalid JSON', async () => {
        process.env.GEMINI_API_KEY = 'test-key';

        const { __generateContentMock } = await import('@google/generative-ai') as any;
        __generateContentMock.mockResolvedValue({
            response: {
                text: () => 'I think you should buy a size M because you are tall.'
            }
        });

        const req = new Request('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({
                height: '160',
                weight: '55',
                bodyType: 'slim',
                product: {
                    name: 'Test Shirt',
                    sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
                }
            })
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.size).toBeDefined();
        // Fallback for <165 height and <60 weight should pick XS or S
        expect(['XS', 'S']).toContain(data.size);
    });
});
