import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';

const mQueryFindFirst = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findFirst: (...args: any[]) => mQueryFindFirst(...args),
      },
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: 'test-user-id' } }),
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
              text: () => '{"size": "L", "explanation": "Mock explanation"}',
            },
          }),
        };
      }
    },
  };
});

describe('POST /api/ai-fit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'dummy-gemini-key';
  });

  test('returns 400 if missing productId or measurements', async () => {
    const req = new Request('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test('returns 404 if product is not found', async () => {
    mQueryFindFirst.mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'invalid', measurements: { height: 180, weight: 75 } }),
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  test('uses fallback logic if GEMINI_API_KEY is dummy', async () => {
    mQueryFindFirst.mockResolvedValueOnce({
      id: 'valid',
      name: 'Test Shirt',
      sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }],
    });

    const req = new Request('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'valid', measurements: { height: 180, weight: 90 } }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.size).toBe('L');
    expect(data.explanation).toContain('fallback mode');
  });

  test('uses AI logic if GEMINI_API_KEY is present', async () => {
    process.env.GEMINI_API_KEY = 'real-key';
    mQueryFindFirst.mockResolvedValueOnce({
      id: 'valid',
      name: 'Test Shirt',
      brand: 'Test Brand',
      sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }],
      description: 'Cool shirt',
    });

    const req = new Request('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'valid', measurements: { height: 180, weight: 75 } }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.size).toBe('L');
    expect(data.explanation).toBe('Mock explanation');
  });
});
