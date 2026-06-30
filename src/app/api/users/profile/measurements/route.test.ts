import { expect, test, describe, vi, beforeEach } from 'vitest';
import { PATCH } from './route';

const { mockGetSession } = vi.hoisted(() => ({
    mockGetSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: mockGetSession
        }
    }
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers())
}));

const { mockUpdate, mockSet, mockWhere } = vi.hoisted(() => ({
    mockUpdate: vi.fn(),
    mockSet: vi.fn(),
    mockWhere: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
    db: {
        update: vi.fn(() => ({
            set: vi.fn((data) => {
                mockSet(data);
                return {
                    where: mockWhere
                };
            })
        }))
    }
}));

describe('User Measurements API Route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('returns 401 if unauthorized', async () => {
        mockGetSession.mockResolvedValue(null);

        const req = new Request('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({})
        });

        const res = await PATCH(req);
        expect(res.status).toBe(401);
    });

    test('updates user profile', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'user1' } });
        mockWhere.mockResolvedValue([]);

        const req = new Request('http://localhost/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180', weight: '80', bodyType: 'Athletic' })
        });

        const res = await PATCH(req);
        expect(res.status).toBe(200);

        expect(mockSet).toHaveBeenCalledWith({
            height: '180',
            weight: '80',
            bodyType: 'Athletic'
        });
    });
});
