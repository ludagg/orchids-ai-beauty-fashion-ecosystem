import { expect, test, describe, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/db', () => ({
    db: {
        select: vi.fn(),
        query: {
            users: {
                findMany: vi.fn(),
            },
        },
    },
}));

vi.mock('drizzle-orm', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        eq: vi.fn(),
        desc: vi.fn(),
        count: vi.fn(),
        inArray: vi.fn(),
        and: vi.fn(),
    };
});

import { db } from '@/lib/db';
import { eq, desc, count, inArray, and } from 'drizzle-orm';

describe('GET /api/creators', () => {
    let mockReq: NextRequest;

    beforeEach(() => {
        vi.clearAllMocks();
        mockReq = new NextRequest('http://localhost:3000/api/creators');
    });

    test('returns empty array if no top creators', async () => {
        const mockSelect = {
            from: vi.fn().mockReturnThis(),
            groupBy: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue([]),
        };
        (db.select as any).mockReturnValue(mockSelect);

        const res = await GET(mockReq);
        const data = await res.json();
        expect(data).toEqual([]);
    });

    test('returns creators with live status correctly sorted', async () => {
        // 1. Mock top creators aggregate
        const topCreatorsMock = [
            { userId: 'user-1', videoCount: 10 },
            { userId: 'user-2', videoCount: 8 },
            { userId: 'user-3', videoCount: 5 },
        ];

        const mockSelectTop = {
            from: vi.fn().mockReturnThis(),
            groupBy: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue(topCreatorsMock),
        };
        (db.select as any).mockReturnValueOnce(mockSelectTop);

        // 2. Mock finding user profiles
        const usersMock = [
            { id: 'user-2', name: 'User Two', image: 'avatar2.jpg' },
            { id: 'user-1', name: 'User One', image: 'avatar1.jpg' },
            { id: 'user-3', name: 'User Three', image: 'avatar3.jpg' },
        ];
        (db.query.users.findMany as any).mockResolvedValue(usersMock);

        // 3. Mock live videos batch query
        // Only user-2 and user-3 are live
        const liveVideosMock = [
            { userId: 'user-2' },
            { userId: 'user-3' },
        ];
        const mockSelectLive = {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValue(liveVideosMock),
        };
        (db.select as any).mockReturnValueOnce(mockSelectLive);

        const res = await GET(mockReq);
        const data = await res.json();

        // Expect user-2 and user-3 (live) to be first, ordered by original count order (user-2 then user-3)
        // Then user-1 (not live)
        expect(data).toHaveLength(3);

        expect(data[0].id).toBe('user-2');
        expect(data[0].isLive).toBe(true);
        expect(data[0].name).toBe('User Two');
        expect(data[0].avatar).toBe('avatar2.jpg');

        expect(data[1].id).toBe('user-3');
        expect(data[1].isLive).toBe(true);
        expect(data[1].name).toBe('User Three');

        expect(data[2].id).toBe('user-1');
        expect(data[2].isLive).toBe(false);
        expect(data[2].name).toBe('User One');
    });

    test('returns 500 on database error', async () => {
        (db.select as any).mockImplementation(() => {
            throw new Error("DB Error");
        });

        const res = await GET(mockReq);
        expect(res.status).toBe(500);

        const data = await res.json();
        expect(data.error).toBe("Internal Server Error");
    });
});
