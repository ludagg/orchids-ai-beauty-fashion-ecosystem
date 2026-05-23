import { expect, test, describe, mock, afterEach } from 'bun:test';
import { NextRequest } from 'next/server';

const mockGenerateContent = mock(async () => {
  return {
    response: {
      text: () => "robe rouge",
    },
  };
});

mock.module('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: mockGenerateContent,
        };
      }
    },
  };
});

// Important: import after mocking is setup and we need to pass a mock key otherwise the real one is initialized on load
process.env.GEMINI_API_KEY = "dummy-key-for-load";
import { POST } from './route';

describe('POST /api/search/image', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    mockGenerateContent.mockClear();
  });

  test('should return 503 if GEMINI_API_KEY is missing', async () => {
    process.env = { ...originalEnv };
    delete process.env.GEMINI_API_KEY;

    const req = new NextRequest('http://localhost:3000/api/search/image', {
      method: 'POST',
      body: new FormData(),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('Service unavailable');
  });

  test('should return 400 if no image is provided', async () => {
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-key' };

    const req = new NextRequest('http://localhost:3000/api/search/image', {
      method: 'POST',
      body: new FormData(),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('No image provided');
  });

  test('should return a query when a valid image is provided', async () => {
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-key' };

    const formData = new FormData();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    formData.append('image', file);

    const req = new NextRequest('http://localhost:3000/api/search/image', {
      method: 'POST',
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.query).toBe('robe rouge');
    expect(mockGenerateContent).toHaveBeenCalled();
  });
});
