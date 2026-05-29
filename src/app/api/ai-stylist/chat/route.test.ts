import { describe, expect, test, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: vi.fn(),
      },
    },
  },
}));

const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      constructor() {}
      getGenerativeModel() {
        return {
          generateContent: mockGenerateContent,
        };
      }
    },
  };
});

describe('AI Stylist Chat Route', () => {
  let dbMock: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    delete process.env.GEMINI_API_KEY;
    const dbModule = await import('@/lib/db');
    dbMock = dbModule.db;
  });

  const createRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  test('returns 400 if message is missing', async () => {
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Message is required');
  });

  test('uses fallback keyword matching when GEMINI_API_KEY is missing', async () => {
    const productsResult = [{ id: '1', name: 'Red Dress', status: 'ACTIVE', visibility: 'PUBLIC' }];
    dbMock.query.products.findMany.mockResolvedValueOnce(productsResult);

    const req = createRequest({ message: 'I need a red dress' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(dbMock.query.products.findMany).toHaveBeenCalledTimes(1);
    expect(json.products).toEqual(productsResult);
    expect(json.message).toContain('red');
    expect(json.message).toContain('dress');
  });

  test('uses Gemini API when key is present', async () => {
    process.env.GEMINI_API_KEY = 'test_key';
    const productsResult = [{ id: '2', name: 'Blue Shirt', status: 'ACTIVE', visibility: 'PUBLIC' }];
    dbMock.query.products.findMany.mockResolvedValueOnce(productsResult);

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify({
          reply: 'Here is a blue shirt for you!',
          searchCriteria: {
            category: ['shirt'],
            color: ['blue'],
            occasion: [],
            keywords: []
          }
        })
      }
    });

    const req = createRequest({ message: 'I want a blue shirt' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(dbMock.query.products.findMany).toHaveBeenCalledTimes(1);
    expect(json.products).toEqual(productsResult);
    expect(json.message).toBe('Here is a blue shirt for you!');
  });
});
