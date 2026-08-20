import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Map())
}));

// Mock dependencies
const { mDbQuery, mAuthGetSession } = vi.hoisted(() => ({
    mDbQuery: { findFirst: vi.fn() },
    mAuthGetSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
    db: { query: { users: mDbQuery, products: mDbQuery } },
}));

vi.mock('@/lib/auth', () => ({
    auth: { api: { getSession: mAuthGetSession } },
}));

vi.mock('@google/generative-ai', () => {
    const GoogleGenerativeAI = vi.fn();
    GoogleGenerativeAI.prototype.getGenerativeModel = vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
            response: {
                text: () => JSON.stringify({
                    recommendedSize: "L",
                    confidence: 0.9,
                    explanation: "Gemini says L",
                    fitType: "regular"
                })
            }
        })
    });
    return { GoogleGenerativeAI };
});

describe('POST /api/ai-fit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = "dummy-key";
    });

    it('returns error if productId is missing', async () => {
        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ height: 180, weight: 80 })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe("Product ID is required");
    });

    it('returns 404 if product is not found', async () => {
        mAuthGetSession.mockResolvedValue(null);
        mDbQuery.findFirst.mockResolvedValue(null); // Product not found

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: "p1", height: 180, weight: 80 })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(404);
        expect(data.error).toBe("Product not found");
    });

    it('returns fallback data when GEMINI_API_KEY is not set', async () => {
        delete process.env.GEMINI_API_KEY;
        mAuthGetSession.mockResolvedValue(null);
        mDbQuery.findFirst.mockResolvedValue({ id: "p1", name: "Shirt", mainCategory: "tops" });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: "p1", height: 195, weight: 95 })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.recommendedSize).toBe("XL"); // Fallback logic gives XL for height > 190 and weight > 90
    });

    it('returns gemini data when API is called successfully', async () => {
        mAuthGetSession.mockResolvedValue(null);
        mDbQuery.findFirst.mockResolvedValue({ id: "p1", name: "Shirt", mainCategory: "tops" });

        const req = new NextRequest('http://localhost/api/ai-fit', {
            method: 'POST',
            body: JSON.stringify({ productId: "p1", height: 180, weight: 80 })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.recommendedSize).toBe("L");
        expect(data.explanation).toBe("Gemini says L");
    });
});
