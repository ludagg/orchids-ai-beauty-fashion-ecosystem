import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';

// Mock dependencies
const mockGetSession = vi.fn();
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (...args: any[]) => mockGetSession(...args)
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers())
}));

// Mock db queries
const mockFindFirst = vi.fn();
const mockUpdate = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: (...args: any[]) => mockFindFirst(...args)
      }
    },
    update: () => ({
      set: () => ({
        where: (...args: any[]) => mockUpdate(...args)
      })
    }),
    select: (...args: any[]) => {
      mockSelect(...args);
      return {
        from: (...args: any[]) => {
          mockFrom(...args);
          return {
            where: (...args: any[]) => mockWhere(...args)
          };
        }
      };
    }
  }
}));

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: () => 'abc123'
}));

// Mock LoyaltyEngine
const mockAddPoints = vi.fn();
vi.mock('@/lib/loyalty', () => ({
  LoyaltyEngine: {
    addPoints: (...args: any[]) => mockAddPoints(...args)
  }
}));

describe('Loyalty Referral API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/loyalty/referral', () => {
    it('should return 401 if unauthorized', async () => {
      mockGetSession.mockResolvedValueOnce(null);

      const req = new Request('http://localhost:3000/api/loyalty/referral');
      const res = await GET(req as any);

      expect(res.status).toBe(401);
    });

    it('should return existing referral info', async () => {
      mockGetSession.mockResolvedValueOnce({
        user: { id: 'user1', name: 'Test User' }
      });

      mockFindFirst.mockResolvedValueOnce({
        referralCode: 'TES-123456',
        name: 'Test User',
        referredById: 'user2'
      });

      mockWhere.mockResolvedValueOnce([{ count: 3 }]);

      const req = new Request('http://localhost:3000/api/loyalty/referral');
      const res = await GET(req as any);

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data).toEqual({
        referralCode: 'TES-123456',
        referralCount: 3,
        hasReferredBy: true
      });
    });

    it('should generate a new code if one does not exist', async () => {
      mockGetSession.mockResolvedValueOnce({
        user: { id: 'user1', name: 'Alice' }
      });

      mockFindFirst.mockResolvedValueOnce({
        referralCode: null,
        name: 'Alice',
        referredById: null
      });

      mockWhere.mockResolvedValueOnce([{ count: 0 }]);
      mockUpdate.mockResolvedValueOnce({}); // Simulating successful update

      const req = new Request('http://localhost:3000/api/loyalty/referral');
      const res = await GET(req as any);

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.referralCode).toBe('ALI-ABC123');
      expect(data.referralCount).toBe(0);
      expect(data.hasReferredBy).toBe(false);
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('POST /api/loyalty/referral', () => {
    it('should return 401 if unauthorized', async () => {
      mockGetSession.mockResolvedValueOnce(null);

      const req = new Request('http://localhost:3000/api/loyalty/referral', {
        method: 'POST',
        body: JSON.stringify({ code: 'SOME-CODE' })
      });
      const res = await POST(req as any);

      expect(res.status).toBe(401);
    });

    it('should return 400 if user has already applied a code', async () => {
      mockGetSession.mockResolvedValueOnce({
        user: { id: 'user1' }
      });

      mockFindFirst.mockResolvedValueOnce({
        referredById: 'user2',
        referralCode: 'MY-CODE'
      });

      const req = new Request('http://localhost:3000/api/loyalty/referral', {
        method: 'POST',
        body: JSON.stringify({ code: 'FRIEND-CODE' })
      });
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('You have already applied a referral code');
    });

    it('should return 400 if trying to apply own code', async () => {
      mockGetSession.mockResolvedValueOnce({
        user: { id: 'user1' }
      });

      mockFindFirst.mockResolvedValueOnce({
        referredById: null,
        referralCode: 'MY-CODE'
      });

      const req = new Request('http://localhost:3000/api/loyalty/referral', {
        method: 'POST',
        body: JSON.stringify({ code: 'MY-CODE' })
      });
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('You cannot apply your own referral code');
    });

    it('should successfully apply valid referral code', async () => {
      mockGetSession.mockResolvedValueOnce({
        user: { id: 'user1', name: 'Bob' }
      });

      // Current user
      mockFindFirst.mockResolvedValueOnce({
        referredById: null,
        referralCode: 'BOB-CODE'
      });

      // Referrer user
      mockFindFirst.mockResolvedValueOnce({
        id: 'user2',
        name: 'Alice'
      });

      const req = new Request('http://localhost:3000/api/loyalty/referral', {
        method: 'POST',
        body: JSON.stringify({ code: 'ALI-CODE' })
      });
      const res = await POST(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      expect(mockUpdate).toHaveBeenCalled();
      expect(mockAddPoints).toHaveBeenCalledTimes(2);
      expect(mockAddPoints).toHaveBeenNthCalledWith(
        1,
        'user2', // referrer
        500,
        'referral_bonus',
        expect.stringContaining('Bob'),
        'user1'
      );
      expect(mockAddPoints).toHaveBeenNthCalledWith(
        2,
        'user1', // referee
        200,
        'referral_bonus',
        expect.stringContaining('Alice'),
        'user2'
      );
    });
  });
});
