import { expect, test, describe, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import { NextRequest } from 'next/server';

// Mock Next.js headers
vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

// Mock Auth
const mockGetSession = vi.fn();
vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: (...args: any[]) => mockGetSession(...args)
        }
    }
}));

// Mock Drizzle
const mockDbUpdate = vi.fn();
const mockDbSet = vi.fn();
const mockDbWhere = vi.fn();
vi.mock('@/lib/db', () => ({
    db: {
        update: (...args: any[]) => mockDbUpdate(...args)
    }
}));

// Mock schema
vi.mock('@/db/schema', () => ({
    users: { id: 'users.id' }
}));

vi.mock('drizzle-orm', async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        eq: vi.fn()
    };
});

describe('PATCH /api/users/profile/measurements', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        mockDbUpdate.mockImplementation(() => ({
            set: mockDbSet.mockImplementation(() => ({
                where: mockDbWhere.mockResolvedValue({})
            }))
        }));
    });

    test('returns 401 if unauthorized', async () => {
        mockGetSession.mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180' })
        });

        const res = await PATCH(req);
        expect(res.status).toBe(401);
    });

    test('returns 400 if no fields to update', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });

        const req = new NextRequest('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ unrelatedField: 'test' })
        });

        const res = await PATCH(req);
        expect(res.status).toBe(400);
    });

    test('updates measurements successfully', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });

        const req = new NextRequest('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180', weight: '75', bodyType: 'athletic' })
        });

        const res = await PATCH(req);
        expect(res.status).toBe(200);

        expect(mockDbUpdate).toHaveBeenCalled();
        expect(mockDbSet).toHaveBeenCalledWith(expect.objectContaining({
            height: '180',
            weight: '75',
            bodyType: 'athletic'
        }));
        expect(mockDbWhere).toHaveBeenCalled();
    });
});