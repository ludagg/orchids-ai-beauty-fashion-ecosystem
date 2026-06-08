import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Mock DB
const mockFindFirst = vi.fn();
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findFirst: (...args: any[]) => mockFindFirst(...args),
      },
    },
  },
}));

// Mock GoogleGenerativeAI
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: (...args: any[]) => mockGenerateContent(...args),
      };
    }
  },
}));

// Mock NextRequest
class MockNextRequest {
  private body: any;
  constructor(body: any) {
    this.body = body;
  }
  async json() {
    return this.body;
  }
}

describe('AI Fit Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'mock-api-key';
  });

  test('returns 400 if productId is missing', async () => {
    const req = new MockNextRequest({}) as any;
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  test('returns 404 if product is not found', async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    const req = new MockNextRequest({ productId: 'invalid', userMeasurements: {} }) as any;
    const response = await POST(req);
    expect(response.status).toBe(404);
  });

  test('returns AI recommendation based on Gemini response', async () => {
    mockFindFirst.mockResolvedValueOnce({
      id: 'prod_1',
      name: 'Cool Shirt',
      brand: 'CoolBrand',
      sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
    });

    const mockGeminiResponse = {
      recommendedSize: 'L',
      analysis: 'Because it fits.',
      confidence: 95,
      dataPoints: 10
    };

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify(mockGeminiResponse)
      }
    });

    const req = new MockNextRequest({
      productId: 'prod_1',
      userMeasurements: { height: '180cm', weight: '80kg' }
    }) as any;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.recommendedSize).toBe('L');
    expect(data.confidence).toBe(95);
  });

  test('uses fallback mock when GEMINI_API_KEY is missing', async () => {
    process.env.GEMINI_API_KEY = '';
    mockFindFirst.mockResolvedValueOnce({
      id: 'prod_2',
      brand: 'TestBrand',
    });

    const req = new MockNextRequest({
      productId: 'prod_2',
      userMeasurements: { height: '170cm' }
    }) as any;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.recommendedSize).toBe('M');
    expect(data.analysis).toContain('TestBrand');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });
});
