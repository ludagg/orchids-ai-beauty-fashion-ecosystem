import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

const mockGetSession = vi.fn();
const mockHeaders = vi.fn().mockResolvedValue(new Headers());

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (...args: any[]) => mockGetSession(...args)
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: () => mockHeaders()
}));

const mockUserQuery = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: (...args: any[]) => mockUserQuery(...args)
      }
    }
  }
}));

const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: (...args: any[]) => mockGenerateContent(...args)
      };
    }
  }
}));

describe('AI Fit Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should return 401 if unauthorized', async () => {
    mockGetSession.mockResolvedValue(null);
    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 if productId is missing', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user1' } });
    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return recommendation from Gemini if user has measurements', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user1' } });
    mockUserQuery.mockResolvedValue({ height: '180cm', weight: '75kg', bodyType: 'athletic' });

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ recommendation: 'L', confidence: 0.9, reasoning: 'Looks good' })
      }
    });

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod1', brand: 'Nike' })
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.recommendation).toBe('L');
    expect(json.confidence).toBe(0.9);
  });

  it('should return fallback if no measurements', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user1' } });
    mockUserQuery.mockResolvedValue({});

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod1' })
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.recommendation).toBe('M'); // The fallback size
  });
});
