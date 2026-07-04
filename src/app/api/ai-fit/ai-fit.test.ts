import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const { mockGetSession } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

const { mockFindUser, mockFindProduct } = vi.hoisted(() => ({
  mockFindUser: vi.fn(),
  mockFindProduct: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: mockFindUser,
      },
      products: {
        findFirst: mockFindProduct,
      },
    },
  },
}));

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: mockGenerateContent,
      };
    }
  },
}));

describe('POST /api/ai-fit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  test('returns 401 if unauthorized', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod-1' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test('returns 400 if product ID is missing', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: 'user-1' } });

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test('returns 404 if product not found', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: 'user-1' } });
    mockFindUser.mockResolvedValueOnce({ height: '170cm' });
    mockFindProduct.mockResolvedValueOnce(null);

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod-1' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  test('returns AI recommendation successfully', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: 'user-1' } });
    mockFindUser.mockResolvedValueOnce({ height: '170cm', weight: '65kg' });
    mockFindProduct.mockResolvedValueOnce({ name: 'Test Shirt' });

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify({ size: 'M', explanation: 'Perfect fit', confidence: 90 })
      }
    });

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod-1' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.size).toBe('M');
    expect(data.explanation).toBe('Perfect fit');
    expect(data.confidence).toBe(90);
  });

  test('uses fallback if API key missing', async () => {
    delete process.env.GEMINI_API_KEY;
    mockGetSession.mockResolvedValueOnce({ user: { id: 'user-1' } });
    mockFindUser.mockResolvedValueOnce({ height: '190cm', weight: '80kg' });
    mockFindProduct.mockResolvedValueOnce({ name: 'Test Shirt' });

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod-1' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.size).toBe('L');
    expect(data.explanation).toContain('recommend size L');
  });
});
