import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'user-123' }
      })
    }
  }
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn().mockResolvedValue({
          id: 'user-123',
          height: "175cm",
          weight: "70kg",
          bodyType: "athletic"
        })
      },
      products: {
        findFirst: vi.fn().mockResolvedValue({
          id: 'prod-123',
          name: 'Cool Shirt',
          brand: 'Nike',
          sizes: ['S', 'M', 'L']
        })
      }
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('AI Fit Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if productId is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Product ID is required');
  });

  it('should return a fallback recommendation if no API key is provided', async () => {
    const originalEnv = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod-123' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('recommendedSize');
    expect(['S', 'M', 'L']).toContain(data.recommendedSize);
    expect(data).toHaveProperty('confidence');

    process.env.GEMINI_API_KEY = originalEnv;
  });
});
