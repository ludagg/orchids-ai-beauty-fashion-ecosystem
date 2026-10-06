import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from './route';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Map())
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue({}),
      })),
    })),
  },
}));

describe('Measurements API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if unauthorized', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/users/profile/measurements');
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    it('should return 404 if user not found', async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      (db.query.users.findFirst as any).mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/users/profile/measurements');
      const res = await GET(req);
      expect(res.status).toBe(404);
    });

    it('should return user measurements', async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      (db.query.users.findFirst as any).mockResolvedValue({ height: '170', weight: '70', bodyType: 'Athletic' });
      const req = new NextRequest('http://localhost/api/users/profile/measurements');
      const res = await GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ height: '170', weight: '70', bodyType: 'Athletic' });
    });
  });

  describe('PATCH', () => {
    it('should return 401 if unauthorized', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/users/profile/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: '175' }),
      });
      const res = await PATCH(req);
      expect(res.status).toBe(401);
    });

    it('should return 400 if no valid data to update', async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      const req = new NextRequest('http://localhost/api/users/profile/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ invalidField: 'test' }),
      });
      const res = await PATCH(req);
      expect(res.status).toBe(400);
    });

    it('should update measurements and return success', async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      const req = new NextRequest('http://localhost/api/users/profile/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: '180', weight: '75', bodyType: 'Slim' }),
      });
      const res = await PATCH(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ message: 'Measurements updated successfully' });
      expect(db.update).toHaveBeenCalled();
    });
  });
});