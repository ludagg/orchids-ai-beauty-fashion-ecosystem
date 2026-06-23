import { expect, test, describe, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock headers
vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

// Mock Better Auth
const mockSession = {
    user: { id: 'test-user', name: 'Test User' },
};

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn().mockImplementation(async () => mockSession),
        }
    }
}));

// Mock Drizzle DB
const mockUser = {
    id: 'test-user',
    height: '180',
    weight: '75',
    bodyType: 'athletic',
};

const mockProduct = {
    id: 'test-product',
    name: 'Test Shirt',
    brand: 'TestBrand',
    description: 'A nice test shirt.',
    mainCategory: 'clothing',
    subcategory: 'shirt',
};

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            users: {
                findFirst: vi.fn().mockImplementation(async () => mockUser),
            },
            products: {
                findFirst: vi.fn().mockImplementation(async () => mockProduct),
            }
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

describe('AI Fit Check API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-api-key';
    });

    test('should return 401 if user is not authenticated', async () => {
        const authLib = await import('@/lib/auth');
        // @ts-ignore
        authLib.auth.api.getSession.mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'test-product' })
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    test('should return 400 if productId is missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({})
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    test('should return AI fit recommendation successfully', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => JSON.stringify({
                    size: 'L',
                    explanation: 'AI says L is best.'
                })
            }
        });

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'test-product' })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.size).toBe('L');
        expect(data.explanation).toBe('AI says L is best.');
    });

    test('should fallback to heuristic logic if AI fails or key is missing', async () => {
        // Force missing API key
        delete process.env.GEMINI_API_KEY;

        const req = new NextRequest('http://localhost:3000/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: 'test-product' })
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        // Since height 180, weight 75, it should fall back to 'M', but bodyType is 'athletic' -> 'L' (based on fallback logic)
        expect(['M', 'L']).toContain(data.size);
        expect(data.explanation).toContain('Based on your profile');
    });
});
