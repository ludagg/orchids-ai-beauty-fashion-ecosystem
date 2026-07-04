import { expect, test, describe, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import { NextResponse } from 'next/server';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const { mockGetSession } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

const { mTx } = vi.hoisted(() => ({
  mTx: {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 'test-user', height: '180cm', weight: '75kg', bodyType: 'athletic' }]),
  },
}));

vi.mock('@/lib/db', () => ({
  db: mTx,
}));

describe('PATCH /api/users/profile/measurements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns 401 if unauthorized', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const req = new Request('http://localhost:3000/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({ height: '180cm' }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  test('returns 400 if no fields are provided', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: 'test-user' } });

    const req = new Request('http://localhost:3000/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({}),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  test('updates measurements and returns updated user', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: 'test-user' } });

    const req = new Request('http://localhost:3000/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({ height: '180cm', weight: '75kg', bodyType: 'athletic' }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.height).toBe('180cm');
    expect(data.weight).toBe('75kg');
    expect(data.bodyType).toBe('athletic');

    expect(mTx.update).toHaveBeenCalled();
    expect(mTx.set).toHaveBeenCalled();
    expect(mTx.where).toHaveBeenCalled();
    expect(mTx.returning).toHaveBeenCalled();
  });
});
