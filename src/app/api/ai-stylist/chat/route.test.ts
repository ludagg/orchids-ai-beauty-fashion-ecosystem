import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: vi.fn(),
      },
    },
  },
}));

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => JSON.stringify({
                reply: "Here are some beautiful dresses for your summer party!",
                searchCriteria: {
                  category: ["dress"],
                  color: [],
                  occasion: ["summer party"],
                  keywords: []
                }
              })
            }
          })
        };
      }
    }
  };
});

describe('AI Stylist API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return 400 if message is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Message is required');
  });

  test('should call Gemini API and return products', async () => {
    const originalEnv = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = 'test_key';

    const { db } = await import('@/lib/db');
    (db.query.products.findMany as any).mockResolvedValue([
      { id: '1', name: 'Summer Dress', salePrice: 5000 }
    ]);

    const req = new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: "I need a summer party dress" }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toBe("Here are some beautiful dresses for your summer party!");
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Summer Dress');

    process.env.GEMINI_API_KEY = originalEnv;
  });

  test('should fallback to keyword matching when Gemini API key is missing', async () => {
    const originalEnv = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const { db } = await import('@/lib/db');
    (db.query.products.findMany as any).mockResolvedValue([
      { id: '1', name: 'Red Shirt', salePrice: 3000 }
    ]);

    const req = new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: "Show me a red shirt" }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toContain("I found some lovely red shirt options");
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Red Shirt');

    process.env.GEMINI_API_KEY = originalEnv;
  });
});
