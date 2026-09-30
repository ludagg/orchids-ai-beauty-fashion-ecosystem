import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from './route';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      }
    },
    update: vi.fn(),
  }
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn()
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map())
}));

describe('/api/users/profile/measurements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if unauthorized', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);
      const req = new Request('http://localhost:3000/api/users/profile/measurements');
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    it('should return user measurements if authorized', async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      (db.query.users.findFirst as any).mockResolvedValue({
        height: '180cm',
        weight: '75kg',
        bodyType: 'Athletic'
      });

      const req = new Request('http://localhost:3000/api/users/profile/measurements');
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({
        height: '180cm',
        weight: '75kg',
        bodyType: 'Athletic'
      });
    });
  });

  describe('PATCH', () => {
    it('should return 401 if unauthorized', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);
      const req = new Request('http://localhost:3000/api/users/profile/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: '180cm' })
      });
      const res = await PATCH(req);
      expect(res.status).toBe(401);
    });

    it('should return 400 if no data is provided', async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user-1' } });
      const req = new Request('http://localhost:3000/api/users/profile/measurements', {
        method: 'PATCH',
        body: JSON.stringify({})
      });
      const res = await PATCH(req);
      expect(res.status).toBe(400);
    });

    it('should update user measurements', async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user-1' } });

      const mockSet = vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([{ height: '185cm', weight: '80kg', bodyType: 'Slim' }])
          })
      });
      (db.update as any).mockReturnValue({ set: mockSet });

      const req = new Request('http://localhost:3000/api/users/profile/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: '185cm', weight: '80kg', bodyType: 'Slim' })
      });
      const res = await PATCH(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ height: '185cm', weight: '80kg', bodyType: 'Slim' });
    });
  });
});
