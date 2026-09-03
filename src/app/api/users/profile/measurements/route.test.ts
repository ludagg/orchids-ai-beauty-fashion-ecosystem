import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';

const mockGetSession = vi.fn();
vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: (...args: any[]) => mockGetSession(...args)
        }
    }
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Map())
}));

const mockDbUpdate = vi.fn();
const mockDbSet = vi.fn();
const mockDbWhere = vi.fn();
const mockDbReturning = vi.fn();

vi.mock('@/lib/db', () => ({
    db: {
        update: (...args: any[]) => mockDbUpdate(...args)
    }
}));

vi.mock('@/db/schema', () => ({
    users: { id: 'user-id-col' }
}));

vi.mock('drizzle-orm', () => ({
    eq: vi.fn()
}));

describe('PATCH /api/users/profile/measurements', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockDbUpdate.mockImplementation(() => ({
            set: mockDbSet.mockImplementation(() => ({
                where: mockDbWhere.mockImplementation(() => ({
                    returning: mockDbReturning
                }))
            }))
        }));
    });

    it('returns 401 if not authenticated', async () => {
        mockGetSession.mockResolvedValueOnce(null);

        const req = new Request('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180cm' })
        });

        const res = await PATCH(req);
        expect(res.status).toBe(401);
    });

    it('returns 400 if no measurements provided', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'user-1' } });

        const req = new Request('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({})
        });

        const res = await PATCH(req);
        expect(res.status).toBe(400);
    });

    it('updates user measurements successfully', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'user-1' } });
        mockDbReturning.mockResolvedValueOnce([{ id: 'user-1', height: '180cm', weight: '75kg' }]);

        const req = new Request('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180cm', weight: '75kg' })
        });

        const res = await PATCH(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.height).toBe('180cm');
        expect(data.weight).toBe('75kg');

        expect(mockDbUpdate).toHaveBeenCalled();
        expect(mockDbSet).toHaveBeenCalledWith(expect.objectContaining({
            height: '180cm',
            weight: '75kg'
        }));
    });
});
