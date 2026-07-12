import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

const { mockQueryFindMany } = vi.hoisted(() => ({
  mockQueryFindMany: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: mockQueryFindMany,
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
                reply: "Here is what I found for you:",
                searchCriteria: {
                  category: ["dress"],
                  color: ["red"],
                  occasion: [],
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

describe('AI Stylist API POST', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  test('should fallback to keyword matching when GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY;

    mockQueryFindMany.mockResolvedValueOnce([
      { id: '1', name: 'Red Dress', rating: 5, status: 'ACTIVE', visibility: 'PUBLIC' }
    ]);

    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: "I want a red dress" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.products).toHaveLength(1);
    expect(json.products[0].name).toBe('Red Dress');
    expect(json.message).toContain('red dress');
    expect(mockQueryFindMany).toHaveBeenCalled();
  });

  test('should use Gemini when API key is set', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    mockQueryFindMany.mockResolvedValueOnce([
      { id: '2', name: 'Red Summer Dress', rating: 4.5, status: 'ACTIVE', visibility: 'PUBLIC' }
    ]);

    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: "Find me a red dress for summer" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.products).toHaveLength(1);
    expect(json.products[0].name).toBe('Red Summer Dress');
    expect(json.message).toBe('Here is what I found for you:');
    expect(mockQueryFindMany).toHaveBeenCalled();
  });

  test('should return 400 when message is missing', async () => {
    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Message is required');
  });
});
