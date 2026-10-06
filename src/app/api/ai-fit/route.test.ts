import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => {
    class MockClass {
        getGenerativeModel = vi.fn().mockReturnValue({
            generateContent: mockGenerateContent
        });
    }
    return { GoogleGenerativeAI: MockClass };
});

describe('AI Fit Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should return 400 if product is missing', async () => {
    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ measurements: { height: '170' } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should use fallback if API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ product: { name: 'Test' }, measurements: { height: '190', weight: '95' } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.recommendedSize).toBe('XL');
  });

  it('should return recommendation from Gemini', async () => {
    mockGenerateContent.mockResolvedValue({
        response: {
            text: () => JSON.stringify({ recommendedSize: 'L', explanation: 'AI explanation', confidence: 90 })
        }
    });

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ product: { name: 'Test' }, measurements: { height: '180' } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.recommendedSize).toBe('L');
    expect(data.explanation).toBe('AI explanation');
    expect(data.confidence).toBe(90);
  });

  it('should use fallback if Gemini fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Error'));

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ product: { name: 'Test' }, measurements: { height: '165', weight: '60' } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.recommendedSize).toBe('M'); // fallback logic
  });
});