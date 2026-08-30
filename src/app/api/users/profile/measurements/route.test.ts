import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { PATCH } from './route';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { auth } from '@/lib/auth';

const { mockGetSession } = vi.hoisted(() => ({
    mockGetSession: vi.fn()
}));

const { mockDbUpdate, mockDbSet, mockDbWhere, mockDbReturning } = vi.hoisted(() => {
    const mockReturning = vi.fn().mockResolvedValue([{ id: 'test-user-id', height: '180' }]);
    const mockWhere = vi.fn().mockImplementation(() => ({ returning: mockReturning }));
    const mockSet = vi.fn().mockImplementation(() => ({ where: mockWhere }));
    const mockUpdate = vi.fn().mockImplementation(() => ({ set: mockSet }));
    return { mockDbUpdate: mockUpdate, mockDbSet: mockSet, mockDbWhere: mockWhere, mockDbReturning: mockReturning };
});

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: mockGetSession
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
            body: JSON.stringify({ height: '180' })
        });
        const res = await PATCH(req);
        expect(res.status).toBe(401);
    });

    it('returns 400 if no measurement data provided', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'test-user-id' } });
        const req = new NextRequest('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ someOtherField: 'value' })
        });
        const res = await PATCH(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('No measurement data provided');
    });

    it('updates user measurements successfully', async () => {
        mockGetSession.mockResolvedValueOnce({ user: { id: 'test-user-id' } });
        const req = new NextRequest('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180', weight: '80', bodyType: 'athletic' })
        });
        const res = await PATCH(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(mockDbUpdate).toHaveBeenCalledWith(users);
        expect(mockDbSet).toHaveBeenCalledWith({ height: '180', weight: '80', bodyType: 'athletic' });
        expect(data.message).toBe('Measurements updated successfully');
        expect(data.user).toBeDefined();
    });
});
