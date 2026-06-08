import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findFirst: vi.fn(),
      },
      users: {
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

// Mock GoogleGenerativeAI
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: mockGenerateContent,
        };
      }
    },
  };
});

// Import mocked modules for asserting
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

describe('POST /api/ai-fit', () => {
  const mockProductId = 'prod_123';
  const mockUserId = 'user_123';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test_key';
  });

  const createRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  it('should return 401 if user is not authenticated', async () => {
    (auth.api.getSession as any).mockResolvedValueOnce(null);
    const req = createRequest({ productId: mockProductId });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 if productId is missing', async () => {
    (auth.api.getSession as any).mockResolvedValueOnce({
      user: { id: mockUserId, email: 'test@example.com', emailVerified: true, name: 'Test', createdAt: new Date(), updatedAt: new Date() },
      session: { id: 'sess_1', userId: mockUserId, expiresAt: new Date(), ipAddress: '127.0.0.1', userAgent: 'test', token: 'test' }
    });
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 400 with MISSING_MEASUREMENTS code if user has no profile data', async () => {
    (auth.api.getSession as any).mockResolvedValueOnce({
      user: { id: mockUserId, email: 'test@example.com', emailVerified: true, name: 'Test', createdAt: new Date(), updatedAt: new Date() },
      session: { id: 'sess_1', userId: mockUserId, expiresAt: new Date(), ipAddress: '127.0.0.1', userAgent: 'test', token: 'test' }
    });
    (db.query.products.findFirst as any).mockResolvedValueOnce({
      id: mockProductId,
      name: 'Test Shirt',
      brand: 'BrandX',
      mainCategory: 'Clothing',
      subcategory: 'Shirts',
      description: 'A nice shirt',
    } as any);
    (db.query.users.findFirst as any).mockResolvedValueOnce({
      id: mockUserId,
      height: null,
      weight: null,
      bodyType: null,
      gender: null,
    } as any);

    const req = createRequest({ productId: mockProductId });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.code).toBe('MISSING_MEASUREMENTS');
  });

  it('should call Gemini API and return recommendation if profile data exists', async () => {
    (auth.api.getSession as any).mockResolvedValueOnce({
      user: { id: mockUserId, email: 'test@example.com', emailVerified: true, name: 'Test', createdAt: new Date(), updatedAt: new Date() },
      session: { id: 'sess_1', userId: mockUserId, expiresAt: new Date(), ipAddress: '127.0.0.1', userAgent: 'test', token: 'test' }
    });
    (db.query.products.findFirst as any).mockResolvedValueOnce({
      id: mockProductId,
      name: 'Test Shirt',
      brand: 'BrandX',
      mainCategory: 'Clothing',
      subcategory: 'Shirts',
      description: 'A nice shirt',
    } as any);
    (db.query.users.findFirst as any).mockResolvedValueOnce({
      id: mockUserId,
      height: '180cm',
      weight: '75kg',
      bodyType: 'Athletic',
      gender: 'Male',
    } as any);

    const mockResponseText = JSON.stringify({
      recommendation: "L",
      confidence: 95,
      reasoning: "Based on height and weight",
      fitPrediction: "Regular"
    });

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => mockResponseText,
      },
    });

    const req = createRequest({ productId: mockProductId });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.recommendation).toBe('L');
    expect(data.confidence).toBe(95);
    expect(mockGenerateContent).toHaveBeenCalled();
  });
});
