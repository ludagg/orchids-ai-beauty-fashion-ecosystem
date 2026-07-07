import { expect, test, describe, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const mTx = {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([{ id: '1' }]),
};

vi.mock('@/lib/db', () => ({
  db: {
    update: vi.fn(() => mTx)
  },
}));

describe('PATCH /api/users/profile/measurements', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        const { auth } = await import('@/lib/auth');
        (auth.api.getSession as any).mockResolvedValue({
            user: { id: 'user_123', name: 'Test User' },
        });
    });

    test('returns 401 if unauthorized', async () => {
        const { auth } = await import('@/lib/auth');
        (auth.api.getSession as any).mockResolvedValue(null);

        const req = new NextRequest('http://localhost:3000/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180cm', weight: '75kg', bodyType: 'Average' }),
        });

        const res = await PATCH(req);
        expect(res.status).toBe(401);
    });

    test('returns 400 if missing data', async () => {
        const req = new NextRequest('http://localhost:3000/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180cm' }), // Missing weight and bodyType
        });

        const res = await PATCH(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Missing measurements data');
    });

    test('updates measurements and returns 200 on success', async () => {
        const req = new NextRequest('http://localhost:3000/api/users/profile/measurements', {
            method: 'PATCH',
            body: JSON.stringify({ height: '180cm', weight: '75kg', bodyType: 'Average' }),
        });

        const res = await PATCH(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.success).toBe(true);
        expect(data.message).toBe('Measurements updated successfully');

        const { db } = await import('@/lib/db');
        expect(db.update).toHaveBeenCalled();
        expect(mTx.set).toHaveBeenCalledWith({
            height: '180cm',
            weight: '75kg',
            bodyType: 'Average'
        });
    });
});
