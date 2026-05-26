import { expect, test, describe, beforeEach, afterEach, mock } from 'bun:test';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock DB
mock.module('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: mock(async () => {
          return [
            {
              id: '1',
              name: 'Red Dress',
              description: 'A beautiful red dress for parties',
              mainCategory: 'clothing',
              subcategory: 'dress',
              rating: 5,
            },
            {
              id: '2',
              name: 'Blue Jeans',
              description: 'Comfortable blue jeans',
              mainCategory: 'clothing',
              subcategory: 'pants',
              rating: 4,
            }
          ];
        })
      }
    }
  }
}));

// Mock Google Generative AI
mock.module('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: mock(async () => {
            return {
              response: {
                text: () => JSON.stringify({
                  reply: "I found some great options for you!",
                  searchCriteria: {
                    category: ["dress"],
                    color: ["red"],
                    occasion: ["party"],
                    keywords: []
                  }
                })
              }
            };
          })
        };
      }
    }
  };
});

describe('AI Stylist API', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalEnv;
    }
  });

  test('Missing message returns 400', async () => {
    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Message is required');
  });

  test('Fallback logic works when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'I need a red dress' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toContain('red');
    expect(data.message).toContain('dress');
    expect(data.products).toHaveLength(2);
    expect(data.products[0].name).toBe('Red Dress');
  });

  test('Gemini API matching works', async () => {
    process.env.GEMINI_API_KEY = 'test_key';
    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'I need a red dress for a party' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('I found some great options for you!');
    expect(data.products).toHaveLength(2);
    expect(data.products[0].name).toBe('Red Dress');
  });
});
