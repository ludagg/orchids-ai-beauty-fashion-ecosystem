import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'user-1' },
      }),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const mockUserQuery = vi.fn().mockResolvedValue({
    id: 'user-1',
    height: "180cm",
    weight: "75kg",
    bodyType: "athletic"
});

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: (...args: any) => mockUserQuery(...args),
      },
    },
  },
}));

const mockGenerateContent = vi.fn().mockResolvedValue({
    response: {
        text: () => JSON.stringify({
            recommendedSize: "M",
            confidence: 85,
            analysis: "Based on your height and athletic body type, size M should offer a comfortable fit."
        })
    }
});

vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: mockGenerateContent
                }
            }
        }
    }
});


describe('POST /api/ai-fit', () => {
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
    const { auth } = await import('@/lib/auth');
    (auth.api.getSession as any).mockResolvedValueOnce(null);

    const res = await POST(createRequest({}));
    expect(res.status).toBe(401);
  });

  it('should return 400 if product or sizes are missing', async () => {
    const res = await POST(createRequest({ product: { name: 'Test' } }));
    expect(res.status).toBe(400);
  });

  it('should use Gemini to recommend size', async () => {
    const req = createRequest({
        product: {
            name: "Test Shirt",
            sizes: [{ name: "S" }, { name: "M" }, { name: "L" }]
        }
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.recommendedSize).toBe("M");
    expect(data.confidence).toBe(85);
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should use fallback logic when GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY;

    const req = createRequest({
        product: {
            name: "Test Shirt",
            sizes: [{ name: "S" }, { name: "M" }, { name: "L" }]
        }
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.recommendedSize).toBe("M");
    expect(data.confidence).toBe(60);
    expect(data.analysis).toContain("Based on a basic analysis");
  });

  it('should use fallback logic for light weight users without Gemini', async () => {
    delete process.env.GEMINI_API_KEY;
    mockUserQuery.mockResolvedValueOnce({
        id: 'user-1',
        weight: "50kg",
    });

    const req = createRequest({
        product: {
            name: "Test Shirt",
            sizes: [{ name: "XS" }, { name: "S" }, { name: "M" }, { name: "L" }]
        }
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.recommendedSize).toBe("XS");
  });

  it('should use fallback logic for heavy weight users without Gemini', async () => {
    delete process.env.GEMINI_API_KEY;
    mockUserQuery.mockResolvedValueOnce({
        id: 'user-1',
        weight: "95kg",
    });

    const req = createRequest({
        product: {
            name: "Test Shirt",
            sizes: [{ name: "S" }, { name: "M" }, { name: "L" }, { name: "XL" }]
        }
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.recommendedSize).toBe("XL");
  });

  it('should fallback securely if Gemini returns invalid JSON', async () => {
    mockGenerateContent.mockResolvedValueOnce({
        response: {
            text: () => "Invalid JSON string"
        }
    });

    const req = createRequest({
        product: {
            name: "Test Shirt",
            sizes: [{ name: "S" }, { name: "M" }, { name: "L" }]
        }
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.recommendedSize).toBe("M");
    expect(data.confidence).toBe(50);
  });
});
