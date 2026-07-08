import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock DB
const mockFindMany = vi.fn();
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: (...args: any[]) => mockFindMany(...args)
      }
    }
  }
}));

// Mock Generative AI
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    constructor() {}
    getGenerativeModel() {
      return {
        generateContent: mockGenerateContent
      };
    }
  }
}));

// Mock process.env
const originalEnv = process.env;

describe('POST /api/ai-stylist/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should require a message', async () => {
    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Message is required');
  });

  it('should use fallback logic when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    mockFindMany.mockResolvedValueOnce([{ id: '1', name: 'Red Dress', status: 'ACTIVE', visibility: 'PUBLIC' }]);

    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'I need a red dress for a party' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Red Dress');
    expect(data.message).toContain('I found some lovely red dress party options');

    // Ensure GenerativeAI was NOT called
    expect(mockGenerateContent).not.toHaveBeenCalled();
    // Ensure DB was queried with the fallback logic
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });

  it('should use Gemini when API key is present', async () => {
    process.env.GEMINI_API_KEY = 'test_key';

    // Mock the AI response to match the expected schema
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify({
          reply: "I'd love to help you find a winter jacket!",
          searchCriteria: {
            category: ["jacket"],
            color: ["black"],
            occasion: ["winter"],
            keywords: ["warm"]
          }
        })
      }
    });

    mockFindMany.mockResolvedValueOnce([{ id: '2', name: 'Black Winter Jacket', status: 'ACTIVE', visibility: 'PUBLIC' }]);

    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'I need a warm black winter jacket' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.message).toBe("I'd love to help you find a winter jacket!");
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Black Winter Jacket');

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });

  it('should fallback gracefully if Gemini returns invalid JSON', async () => {
    process.env.GEMINI_API_KEY = 'test_key';

    // Mock the AI response with invalid JSON
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => "This is not valid JSON"
      }
    });

    mockFindMany.mockResolvedValueOnce([{ id: '3', name: 'Sneakers', status: 'ACTIVE', visibility: 'PUBLIC' }]);

    const req = new NextRequest('http://localhost/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'sneakers' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    // The fallback logic will match "sneaker" category from FALLBACK_KEYWORDS
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Sneakers');

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });
});
