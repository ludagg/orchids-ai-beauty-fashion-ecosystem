import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

const mockFindMany = vi.fn();

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            products: {
                findMany: (...args: any[]) => mockFindMany(...args),
            }
        }
    }
}));

const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: mockGenerateContent
                }
            }
        }
    };
});

describe('AI Stylist Chat Route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-key';
    });

    test('should return 400 if message is missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Message is required');
    });

    test('should fallback to keyword matching if API key is missing', async () => {
        delete process.env.GEMINI_API_KEY;

        const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
            method: 'POST',
            body: JSON.stringify({ message: 'I need a red dress' }),
        });

        mockFindMany.mockResolvedValue([{ id: '1', name: 'Red Dress', status: 'ACTIVE', visibility: 'PUBLIC' }]);

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.products.length).toBe(1);
        expect(data.products[0].name).toBe('Red Dress');
        expect(mockFindMany).toHaveBeenCalled();
    });

    test('should use Gemini to extract criteria and return DB results', async () => {
        const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
            method: 'POST',
            body: JSON.stringify({ message: 'I need a black shirt' }),
        });

        const mockedGeminiResponse = {
            reply: 'Here are some black shirts for you!',
            searchCriteria: {
                category: ['shirt'],
                color: ['black'],
                occasion: [],
                keywords: []
            }
        };

        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => JSON.stringify(mockedGeminiResponse)
            }
        });

        mockFindMany.mockResolvedValue([
            { id: '1', name: 'Black Shirt', mainCategory: 'Top', subcategory: 'Shirt', status: 'ACTIVE', visibility: 'PUBLIC' }
        ]);

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.message).toBe(mockedGeminiResponse.reply);
        expect(data.products.length).toBe(1);
        expect(data.products[0].name).toBe('Black Shirt');
        expect(mockGenerateContent).toHaveBeenCalled();
        expect(mockFindMany).toHaveBeenCalled();
    });
});
