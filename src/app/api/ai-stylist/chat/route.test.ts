import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    },
  },
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({
              reply: "Here are some options",
              searchCriteria: { category: ["dress"] }
            })
          }
        })
      };
    }
  }
}));

describe('AI Stylist API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if message is missing', async () => {
    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should process message and return products', async () => {
    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: "I need a red dress" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('products');
  });
});
