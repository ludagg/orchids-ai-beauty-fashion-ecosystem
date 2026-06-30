import { test, expect, vi, describe, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock database
const { mockFindMany } = vi.hoisted(() => {
  return { mockFindMany: vi.fn() };
});

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: mockFindMany
      }
    }
  }
}));

// Mock NextRequest to avoid relying on actual Next.js internals in the test environment
class MockNextRequest extends Request {
  constructor(body: any) {
    super('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

describe('AI Stylist Chat Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns 400 if no message is provided', async () => {
    const req = new MockNextRequest({}) as unknown as NextRequest;
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Message is required');
  });

  test('uses fallback keyword matching when GEMINI_API_KEY is missing', async () => {
    // Ensure no API key
    const originalApiKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    mockFindMany.mockResolvedValue([
      { id: '1', name: 'Red Dress', status: 'ACTIVE', visibility: 'PUBLIC' }
    ]);

    const req = new MockNextRequest({ message: 'I need a red dress' }) as unknown as NextRequest;
    const res = await POST(req);
    const data = await res.json();

    expect(mockFindMany).toHaveBeenCalled();
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Red Dress');
    expect(data.message).toContain('I found some lovely red dress options for you');

    // Restore API key
    process.env.GEMINI_API_KEY = originalApiKey;
  });
});
