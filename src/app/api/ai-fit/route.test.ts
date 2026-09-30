import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';

vi.mock('@google/generative-ai', () => {
  class MockGoogleGenerativeAI {
    getGenerativeModel() {
      return {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({
              recommendation: 'L',
              explanation: 'Based on your height and athletic build, L is recommended.',
              confidence: 85
            })
          }
        })
      };
    }
  }
  return { GoogleGenerativeAI: MockGoogleGenerativeAI };
});

describe('POST /api/ai-fit', () => {
  it('should return a fallback recommendation if no API key is provided', async () => {
    const originalApiKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const req = new Request('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ height: '180cm', weight: '75kg', bodyType: 'Athletic', product: { name: 'T-shirt', category: 'Shirt' } })
    });

    // Using any for NextRequest mock
    const res = await POST(req as any);
    const data = await res.json();

    expect(data.recommendation).toBe('M');

    process.env.GEMINI_API_KEY = originalApiKey;
  });

  it('should call Gemini and return a size recommendation', async () => {
    process.env.GEMINI_API_KEY = 'mocked_key';

    const req = new Request('http://localhost:3000/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({ height: '180cm', weight: '75kg', bodyType: 'Athletic', product: { name: 'T-shirt', category: 'Shirt' } })
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(data.recommendation).toBe('L');
    expect(data.confidence).toBe(85);
  });
});
