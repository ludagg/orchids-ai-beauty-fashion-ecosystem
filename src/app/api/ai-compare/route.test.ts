import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

const { mockFindFirst, mockGenerateContent } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockGenerateContent: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findFirst: mockFindFirst
      }
    }
  }
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: mockGenerateContent
      };
    }
  }
}));

describe('POST /api/ai-compare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should return 400 if missing parameters', async () => {
    const req = new NextRequest('http://localhost/api/ai-compare', {
      method: 'POST',
      body: JSON.stringify({ baseProductId: 'prod_1' }) // Missing targetQuery
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 404 if base product not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/ai-compare', {
      method: 'POST',
      body: JSON.stringify({ baseProductId: 'prod_1', targetQuery: 'shoes' })
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('should return fallback logic if Gemini key is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    // First call for base product, second for target product
    mockFindFirst.mockResolvedValueOnce({ id: 'prod_1', name: 'Expensive Shirt', originalPrice: 10000 });
    mockFindFirst.mockResolvedValueOnce({ id: 'prod_2', name: 'Cheap Shirt', originalPrice: 5000 });

    const req = new NextRequest('http://localhost/api/ai-compare', {
      method: 'POST',
      body: JSON.stringify({ baseProductId: 'prod_1', targetQuery: 'shirt' })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.comparison.summary).toContain('Basic Fallback Analysis');
    expect(data.comparison.summary).toContain('budget-friendly'); // because target is cheaper
  });

  it('should return Gemini generated comparison', async () => {
    mockFindFirst.mockResolvedValueOnce({ id: 'prod_1', name: 'Shirt A', originalPrice: 10000 });
    mockFindFirst.mockResolvedValueOnce({ id: 'prod_2', name: 'Shirt B', originalPrice: 5000 });

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          summary: 'AI comparison summary',
          basePros: ['A', 'B'],
          targetPros: ['C', 'D']
        })
      }
    });

    const req = new NextRequest('http://localhost/api/ai-compare', {
      method: 'POST',
      body: JSON.stringify({ baseProductId: 'prod_1', targetQuery: 'shirt' })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.comparison.summary).toBe('AI comparison summary');
    expect(data.comparison.basePros.length).toBe(2);
  });
});
