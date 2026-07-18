import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

const { mockQuery, mockGetSession, mockGenerateContent } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockGetSession: vi.fn(),
  mockGenerateContent: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findFirst: mockQuery
      }
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers())
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession
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

describe('POST /api/ai-fit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should return 401 if unauthorized', async () => {
    mockGetSession.mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_1' })
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 if user lacks measurements', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user_1' } }); // no height/weight
    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_1' })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return fallback logic if Gemini key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    mockGetSession.mockResolvedValue({ user: { id: 'user_1', height: '180', weight: '75' } });
    mockQuery.mockResolvedValue({ id: 'prod_1', name: 'Shirt' });

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_1' })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.recommendedSize).toBeDefined();
    expect(data.reasoning).toContain('Fallback algorithm applied');
  });

  it('should return Gemini generated recommendation', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user_1', height: '180', weight: '75' } });
    mockQuery.mockResolvedValue({ id: 'prod_1', name: 'Shirt' });

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          recommendedSize: 'L',
          confidence: 90,
          reasoning: 'AI reasoning here.'
        })
      }
    });

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_1' })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.recommendedSize).toBe('L');
    expect(data.confidence).toBe(90);
    expect(data.reasoning).toBe('AI reasoning here.');
  });
});
