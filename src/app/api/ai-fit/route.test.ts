import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers())
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn()
    }
  }
}));

const mockFindFirst = vi.fn();
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: (...args: any[]) => mockFindFirst(...args)
      }
    }
  }
}));

// We must mock the class constructor for GoogleGenerativeAI
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: mockGenerateContent
        };
      }
    }
  };
});

describe('AI Fit Check API Route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-key' };
  });

  test('returns 401 if user is not authenticated', async () => {
    const authModule = await import('@/lib/auth');
    (authModule.auth.api.getSession as any).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: '1', productName: 'Test Shirt' })
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test('returns 400 if product info is missing', async () => {
    const authModule = await import('@/lib/auth');
    (authModule.auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user-1' }
    });

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({}) // Missing productId/productName
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test('returns 400 if user profile lacks measurements', async () => {
    const authModule = await import('@/lib/auth');
    (authModule.auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user-1' }
    });

    mockFindFirst.mockResolvedValue({
      height: null,
      weight: null,
      bodyType: null
    });

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: '1', productName: 'Test Shirt' })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Profile measurements missing');
  });

  test('returns AI recommendation successfully', async () => {
    const authModule = await import('@/lib/auth');
    (authModule.auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user-1' }
    });

    mockFindFirst.mockResolvedValue({
      height: '180cm',
      weight: '75kg',
      bodyType: 'Athletic'
    });

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          size: "L",
          confidence: 90,
          explanation: "L fits best for 180cm athletic builds."
        })
      }
    });

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: '1', productName: 'Test Shirt' })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.recommendation.size).toBe('L');
    expect(json.recommendation.confidence).toBe(90);
  });

  test('handles Gemini API fallback mock when key is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    const authModule = await import('@/lib/auth');
    (authModule.auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user-1' }
    });

    mockFindFirst.mockResolvedValue({
      height: '180cm',
      weight: '75kg',
      bodyType: 'Athletic'
    });

    const req = new NextRequest('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ productId: '1', productName: 'Test Shirt' })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.recommendation.size).toBe('M'); // Mock fallback
    expect(json.recommendation.explanation).toContain('Mock Data');
  });
});
