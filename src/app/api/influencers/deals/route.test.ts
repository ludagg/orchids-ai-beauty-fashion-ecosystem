import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
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

const mockFindMany = vi.fn();
const mockFindFirst = vi.fn();
const mockInsertValues = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      influencerProfiles: {
        findFirst: (...args: any[]) => mockFindFirst(...args),
      },
      brandDeals: {
        findMany: (...args: any[]) => mockFindMany(...args),
      },
    },
    insert: vi.fn().mockReturnValue({
      values: (...args: any[]) => mockInsertValues(...args),
    }),
  },
}));

describe('Influencer Deals API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('returns 401 if not authenticated', async () => {
      const { auth } = await import('@/lib/auth');
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/influencers/deals');
      const res = await GET(req);

      expect(res.status).toBe(401);
    });

    it('returns 200 and deals if user is an influencer', async () => {
      const { auth } = await import('@/lib/auth');
      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user-1', role: 'user' },
        session: {} as any
      });

      mockFindFirst.mockResolvedValueOnce({ id: 'inf-1' });
      mockFindMany.mockResolvedValueOnce([{ id: 'deal-1', title: 'Deal 1' }]);

      const req = new NextRequest('http://localhost:3000/api/influencers/deals');
      const res = await GET(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].title).toBe('Deal 1');
    });
  });

  describe('POST', () => {
    it('returns 401 if user is not a salon_owner or admin', async () => {
      const { auth } = await import('@/lib/auth');
      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user-1', role: 'user' },
        session: {} as any
      });

      const req = new NextRequest('http://localhost:3000/api/influencers/deals', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const res = await POST(req);

      expect(res.status).toBe(401);
    });

    it('returns 201 and creates a deal if user is a salon_owner', async () => {
      const { auth } = await import('@/lib/auth');
      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: 'user-1', role: 'salon_owner' },
        session: {} as any
      });

      const reqBody = {
        influencerId: 'inf-1',
        title: 'New Deal',
        description: 'Test description',
      };

      mockInsertValues.mockReturnValueOnce({
        returning: vi.fn().mockResolvedValueOnce([{ id: 'deal-new', ...reqBody }])
      });

      const req = new NextRequest('http://localhost:3000/api/influencers/deals', {
        method: 'POST',
        body: JSON.stringify(reqBody),
      });
      const res = await POST(req);

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toBe('deal-new');
      expect(data.title).toBe('New Deal');
    });
  });
});
