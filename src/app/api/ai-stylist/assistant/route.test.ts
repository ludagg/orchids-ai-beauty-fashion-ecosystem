import { expect, test, describe, vi } from 'vitest';
import { POST } from './route';

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            salons: {
                findMany: vi.fn().mockResolvedValue([
                    { id: 'salon_1', name: 'Test Salon', averageRating: 4.8 }
                ])
            },
            products: {
                findMany: vi.fn().mockResolvedValue([
                    { id: 'prod_1', name: 'Test Product', rating: 4.5 }
                ])
            }
        }
    }
}));

const mockGenerateContent = vi.fn().mockResolvedValue({
    response: {
        text: () => JSON.stringify({
            intentType: 'salon',
            keywords: ['haircut'],
            reply: 'Here is a great salon for a haircut!'
        })
    }
});

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

describe('AI Beauty & Style Assistant API', () => {
    test('returns 400 if message is missing', async () => {
        const req = new Request('http://localhost:3000/api/ai-stylist/assistant', {
            method: 'POST',
            body: JSON.stringify({})
        }) as any;

        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    test('returns AI assistant response for salon intent', async () => {
        process.env.GEMINI_API_KEY = 'test_key';

        const req = new Request('http://localhost:3000/api/ai-stylist/assistant', {
            method: 'POST',
            body: JSON.stringify({ message: 'I need a haircut' })
        }) as any;

        const res = await POST(req);
        expect(res.status).toBe(200);
        const data = await res.json();

        expect(data.intentType).toBe('salon');
        expect(data.reply).toBe('Here is a great salon for a haircut!');
        expect(data.results.length).toBe(1);
        expect(data.results[0].name).toBe('Test Salon');
    });
});
