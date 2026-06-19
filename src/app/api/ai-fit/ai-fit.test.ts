import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
      products: {
        findFirst: vi.fn(),
      },
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({
              recommendedSize: 'M',
              confidence: 85,
              reasoning: 'Based on your height and weight, M should fit perfectly.'
            })
          }
        })
      };
    }
  }
}));

describe('AI Fit API Endpoint', () => {
  let mockDbQueryUsers: any;
  let mockDbQueryProducts: any;
  let mockAuthGetSession: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const dbModule = await import('@/lib/db');
    mockDbQueryUsers = dbModule.db.query.users.findFirst;
    mockDbQueryProducts = dbModule.db.query.products.findFirst;

    const authModule = await import('@/lib/auth');
    mockAuthGetSession = authModule.auth.api.getSession;
  });

  it('returns 401 if unauthorized', async () => {
    mockAuthGetSession.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_123' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 400 if productId is missing', async () => {
    mockAuthGetSession.mockResolvedValue({ user: { id: 'user_1' } });

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('returns 404 if user profile is not found', async () => {
    mockAuthGetSession.mockResolvedValue({ user: { id: 'user_1' } });
    mockDbQueryUsers.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_123' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(404);
  });

  it('returns 404 if product is not found', async () => {
    mockAuthGetSession.mockResolvedValue({ user: { id: 'user_1' } });
    mockDbQueryUsers.mockResolvedValue({ height: '180cm', weight: '75kg', bodyType: 'athletic' });
    mockDbQueryProducts.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_123' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(404);
  });

  it('returns successful recommendation', async () => {
    // Setup environment for Gemini
    process.env.GEMINI_API_KEY = 'test_key';

    mockAuthGetSession.mockResolvedValue({ user: { id: 'user_1' } });
    mockDbQueryUsers.mockResolvedValue({ height: '180cm', weight: '75kg', bodyType: 'athletic' });
    mockDbQueryProducts.mockResolvedValue({
      id: 'prod_123',
      name: 'Cool T-Shirt',
      brand: 'CoolBrand',
      mainCategory: 'Clothing',
      subcategory: 'T-Shirts',
      sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
    });

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_123' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.recommendedSize).toBe('M');
    expect(data.confidence).toBe(85);
    expect(data.reasoning).toBe('Based on your height and weight, M should fit perfectly.');
  });

  it('falls back to heuristic if API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    mockAuthGetSession.mockResolvedValue({ user: { id: 'user_1' } });
    mockDbQueryUsers.mockResolvedValue({ height: '180cm', weight: '75kg', bodyType: 'athletic' });
    mockDbQueryProducts.mockResolvedValue({
      id: 'prod_123',
      name: 'Cool T-Shirt',
      brand: 'CoolBrand',
      mainCategory: 'Clothing',
      subcategory: 'T-Shirts',
      sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
    });

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod_123' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Since bodyType is athletic and L is available, heuristic will choose L
    expect(data.recommendedSize).toBe('L');
    expect(data.confidence).toBe(65);
    expect(data.reasoning).toContain('standard sizing charts');
  });
});
