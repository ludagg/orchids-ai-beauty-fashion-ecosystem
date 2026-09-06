import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { PATCH } from './route';

const { mockDbUpdate, mockDbUpdateSet } = vi.hoisted(() => {
    const mockDbUpdateSet = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({})
    });
    const mockDbUpdate = vi.fn().mockImplementation(() => ({
        set: mockDbUpdateSet
    }));
    return { mockDbUpdate, mockDbUpdateSet };
});

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

vi.mock('@/lib/db', () => ({
    db: {
        update: mockDbUpdate
    }
}));

describe('PATCH /api/users/profile/measurements', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 401 if unauthorized', async () => {
        mockGetSession.mockResolvedValueOnce(null);
        const req = new NextRequest('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180cm' })
        });
        const res = await PATCH(req);
        expect(res.status).toBe(401);
    });

    it('returns 400 if no fields provided', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });
        const req = new NextRequest('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({})
        });
        const res = await PATCH(req);
        expect(res.status).toBe(400);
    });

    it('updates measurements successfully', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'u1' } });
        const req = new NextRequest('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180cm', weight: '75kg', bodyType: 'athletic' })
        });

        const res = await PATCH(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.message).toBe('Measurements updated successfully');
        expect(mockDbUpdate).toHaveBeenCalled();
        expect(mockDbUpdateSet).toHaveBeenCalledWith({ height: '180cm', weight: '75kg', bodyType: 'athletic' });
    });
});
