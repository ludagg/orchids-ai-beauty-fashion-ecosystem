import { expect, test, describe, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock DB
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: vi.fn().mockResolvedValue([
          { id: '1', name: 'Red Dress', description: 'A beautiful red dress.', status: 'ACTIVE', rating: 5, mainCategory: 'dress' }
        ])
      }
    }
  }
}));

// Mock Gemini
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => JSON.stringify({
                reply: 'Here is a red dress for you!',
                searchCriteria: { category: ['dress'], color: ['red'], occasion: [], keywords: [] }
              })
            }
          })
        };
      }
    }
  };
});

// Mock next/server response
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>();
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({ ...data, ...options }))
    }
  };
});

describe('AI Stylist Chat API', () => {
  test('returns 400 if message is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({})
    });

    const res: any = await POST(req);
    expect(res.error).toBe('Message is required');
    expect(res.status).toBe(400);
  });

  test('successfully responds to user prompt', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    const req = new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'I need a red dress.' })
    });

    const res: any = await POST(req);
    expect(res.message).toBe('Here is a red dress for you!');
    expect(res.products).toHaveLength(1);
    expect(res.products[0].name).toBe('Red Dress');
  });

  test('fallback behavior when API KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    const req = new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'I need a red dress.' })
    });

    const res: any = await POST(req);
    expect(res.message).toContain('lovely');
    expect(res.products).toHaveLength(1);
    expect(res.products[0].name).toBe('Red Dress');
  });
});
