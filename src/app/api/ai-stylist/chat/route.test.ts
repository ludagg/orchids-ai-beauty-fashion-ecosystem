import { describe, it, expect, mock, vi } from 'bun:test';
import { POST } from './route';
import { NextRequest } from 'next/server';

// [Jules - Unit test for AI Stylist Chat to ensure fallback keyword works]

mock.module('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: async () => {
          throw new Error('Mock API Error');
        }
      };
    }
  }
}));

// Mock Drizzle DB query
mock.module('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: mock(async () => [
          { id: '1', name: 'Red Dress', description: 'A beautiful red dress.', category: 'dress', rating: 5 },
          { id: '2', name: 'Blue Dress', description: 'A blue evening dress.', category: 'dress', rating: 4 },
        ])
      }
    }
  }
}));

describe('AI Stylist Chat Route', () => {
  it('should return a 400 if message is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({})
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Message is required");
  });

  it('should fall back to keyword matching if Gemini API fails or is unavailable', async () => {
    // Override API KEY for test
    process.env.GEMINI_API_KEY = "dummy-key";

    const req = new NextRequest('http://localhost:3000/api/ai-stylist/chat', {
      method: 'POST',
      body: JSON.stringify({ message: "I want a red dress for a party" })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    // Fallback logic includes matching keywords like "red", "dress", "party"
    expect(json.message).toContain('I found some lovely');
    expect(json.products).toBeInstanceOf(Array);
    expect(json.products.length).toBeGreaterThan(0);
    expect(json.products[0].name).toBe('Red Dress');
  });
});
