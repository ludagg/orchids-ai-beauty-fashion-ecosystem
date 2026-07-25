import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { PATCH } from './route';
import { db } from '@/lib/db';
import { users } from '@/db/schema/auth';

const { mockAuthSession, mockDbUpdate, mockDbSet, mockDbWhere } = vi.hoisted(() => ({
    mockAuthSession: vi.fn(),
    mockDbUpdate: vi.fn(),
    mockDbSet: vi.fn(),
    mockDbWhere: vi.fn()
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: mockAuthSession,
        },
    },
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/db', () => {
    return {
        db: {
            update: mockDbUpdate.mockImplementation(() => {
                return {
                    set: mockDbSet.mockImplementation(() => {
                        return {
                            where: mockDbWhere.mockResolvedValue({ rowCount: 1 })
                        };
                    })
                };
            })
        }
    };
});

describe('PATCH /api/users/profile/measurements', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 401 if user is not authenticated', async () => {
        mockAuthSession.mockResolvedValueOnce(null);

        const req = new NextRequest('http://localhost:3000/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180' }),
        });

        const res = await PATCH(req);
        expect(res.status).toBe(401);
    });

    it('should update user measurements successfully', async () => {
        mockAuthSession.mockResolvedValueOnce({ user: { id: 'user1' } });

        const req = new NextRequest('http://localhost:3000/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180', weight: '75', bodyType: 'Athletic' }),
        });

        const res = await PATCH(req);
        expect(res.status).toBe(200);

        expect(mockDbUpdate).toHaveBeenCalledWith(users);
        expect(mockDbSet).toHaveBeenCalledWith({
            height: '180',
            weight: '75',
            bodyType: 'Athletic',
        });
        expect(mockDbWhere).toHaveBeenCalled();
    });

    it('should update user measurements with null values when empty', async () => {
        mockAuthSession.mockResolvedValueOnce({ user: { id: 'user1' } });

        const req = new NextRequest('http://localhost:3000/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '', weight: '', bodyType: '' }),
        });

        const res = await PATCH(req);
        expect(res.status).toBe(200);

        expect(mockDbSet).toHaveBeenCalledWith({
            height: null,
            weight: null,
            bodyType: null,
        });
    });
});
