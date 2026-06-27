import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

const mockDbQueryFirst = vi.fn();

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn().mockResolvedValue({
                user: { id: "user-123" }
            })
        }
    }
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

vi.mock('@/lib/db', () => ({
    db: {
        query: {
            users: {
                findFirst: vi.fn((args) => {
                    return Promise.resolve({
                        height: "180cm",
                        weight: "75kg",
                        bodyType: "athletic"
                    });
                })
            },
            products: {
                findFirst: vi.fn((args) => {
                    if (args.where.query?.params?.[0] === "unknown") return Promise.resolve(null);
                    return Promise.resolve({
                        id: "prod-123",
                        name: "Cool Shirt",
                        brand: "BrandX",
                        mainCategory: "Clothing",
                        sizes: [{ name: "S" }, { name: "M" }, { name: "L" }],
                        material: "Cotton",
                        description: "A very cool shirt."
                    });
                })
            }
        }
    }
}));

const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: class {
        getGenerativeModel() {
            return {
                generateContent: mockGenerateContent
            };
        }
    }
}));

describe('AI Fit Check POST /api/ai-fit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = "dummy_key";
    });

    test('should return 400 if product ID is missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: "180" })
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe("Product ID is required");
    });

    test('should return 404 if product is not found', async () => {
        vi.mocked((await import('@/lib/db')).db.query.products.findFirst).mockResolvedValueOnce(null);
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: "unknown" })
        });
        const res = await POST(req);
        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json.error).toBe("Product not found");
    });

    test('should return AI recommendation on success', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => '```json\n{"recommendedSize": "M", "explanation": "Fits well.", "confidence": 0.9, "fitType": "regular"}\n```'
            }
        });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: "prod-123" })
        });
        const res = await POST(req);
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json.recommendedSize).toBe("M");
        expect(json.explanation).toBe("Fits well.");
    });

    test('should use fallback if GEMINI_API_KEY is not set', async () => {
        delete process.env.GEMINI_API_KEY;

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: "prod-123" })
        });
        const res = await POST(req);
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json.recommendedSize).toBeDefined(); // Fallback gives something
        expect(json.explanation).toBeDefined();
    });

    test('should use fallback if Gemini API fails', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error("API Error"));

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: "prod-123" })
        });
        const res = await POST(req);
        expect(res.status).toBe(200); // Does not crash, uses fallback

        const json = await res.json();
        expect(json.recommendedSize).toBeDefined();
    });
});
