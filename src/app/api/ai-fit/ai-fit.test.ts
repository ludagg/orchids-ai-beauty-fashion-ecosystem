import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers())
}));

// Mock better-auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'test-user-id' }
      })
    }
  }
}));

// Mock GoogleGenerativeAI
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

describe('POST /api/ai-fit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  it('should return error if missing measurements', async () => {
    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({
        height: '180'
        // missing weight and bodyType
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing measurements');
  });

  it('should return gemini recommendation', async () => {
    mockGenerateContent.mockResolvedValue({
        response: {
            text: () => JSON.stringify({
                recommendedSize: "L",
                confidenceScore: 90,
                explanation: "L is perfect for your height and weight."
            })
        }
    });

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({
        height: '180',
        weight: '80',
        bodyType: 'athletic',
        availableSizes: ['S', 'M', 'L', 'XL']
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.recommendedSize).toBe('L');
    expect(data.confidenceScore).toBe(90);
    expect(data.explanation).toBe('L is perfect for your height and weight.');
  });

  it('should use fallback if gemini throws', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Down'));

    const req = new NextRequest('http://localhost/api/ai-fit', {
      method: 'POST',
      body: JSON.stringify({
        height: '180',
        weight: '65', // fallback should pick M
        bodyType: 'slim',
        availableSizes: ['S', 'M', 'L', 'XL']
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.recommendedSize).toBe('M');
  });
});
