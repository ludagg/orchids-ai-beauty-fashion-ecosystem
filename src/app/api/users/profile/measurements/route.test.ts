import { expect, test, describe, vi } from 'vitest';
import { PATCH } from './route';
import { NextRequest } from 'next/server';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers())
}));

const mockGetSession = vi.fn();
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (...args: any[]) => mockGetSession(...args)
    }
  }
}));

const mUpdate = vi.fn();
const mSet = vi.fn();
const mWhere = vi.fn();

mUpdate.mockReturnValue({ set: mSet });
mSet.mockReturnValue({ where: mWhere });
mWhere.mockResolvedValue([{ id: 'test_user_id' }]);

vi.mock('@/lib/db', () => ({
  db: {
    update: () => mUpdate()
  }
}));

describe('PATCH /api/users/profile/measurements', () => {
  test('returns 401 if unauthorized', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const req = new NextRequest('http://localhost/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({ height: '180', weight: '75', bodyType: 'athletic' })
    });

    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  test('returns 400 if fields are missing', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'test_user_id', name: 'Test User' }
    });

    const req = new NextRequest('http://localhost/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({ height: '180' }) // Missing weight and bodyType
    });

    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  test('updates user profile successfully', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'test_user_id', name: 'Test User' }
    });

    const req = new NextRequest('http://localhost/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({ height: '180', weight: '75', bodyType: 'athletic' })
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);

    expect(mSet).toHaveBeenCalledWith(expect.objectContaining({
      height: '180',
      weight: '75',
      bodyType: 'athletic'
    }));
  });
});
