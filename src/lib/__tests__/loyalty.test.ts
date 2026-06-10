import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoyaltyEngine } from '../loyalty';
import { db } from '@/lib/db';
import { users } from '@/db/schema/auth';
import { userLevels, pointTransactions, rewards } from '@/db/schema/loyalty';
import { eq, desc } from 'drizzle-orm';

// Mock DB
vi.mock('@/lib/db', () => {
  const mTx = {
    query: {
      users: { findFirst: vi.fn() },
      pointTransactions: { findFirst: vi.fn() },
      rewards: { findFirst: vi.fn() }
    },
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue({}) }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue({}) }) }),
    select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ orderBy: vi.fn() }) }),
  };

  return {
    db: {
      transaction: vi.fn(async (cb) => cb(mTx)),
      query: mTx.query,
      select: mTx.select,
      insert: mTx.insert,
      update: mTx.update,
    }
  };
});

describe('LoyaltyEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addPoints', () => {
    it('should add points correctly without multiplier for non-earned types', async () => {
      // Setup mock data
      const mockTx = (db.transaction as any).mock.calls[0] ? (db.transaction as any).mock.calls[0][0] : undefined;

      const mTx = {
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue({ loyaltyPoints: 100 })
          }
        },
        insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue({}) }),
        update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue({}) }) }),
        select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ orderBy: vi.fn().mockResolvedValue([]) }) })
      };

      (db.transaction as any).mockImplementationOnce(async (cb: any) => cb(mTx));

      // We also mock checkLevelUp inside LoyaltyEngine for this test to avoid complexity
      const spyCheckLevelUp = vi.spyOn(LoyaltyEngine, 'checkLevelUp').mockResolvedValue();

      const newBalance = await LoyaltyEngine.addPoints('user-1', 50, 'bonus', 'Test Bonus');

      expect(mTx.insert).toHaveBeenCalled();
      expect(mTx.update).toHaveBeenCalled();
      expect(newBalance).toBe(150); // 100 + 50

      spyCheckLevelUp.mockRestore();
    });

    it('should calculate multiplier correctly for earned_ types', async () => {
      const mTx = {
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue({ loyaltyPoints: 1000 })
          }
        },
        insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue({}) }),
        update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue({}) }) }),
        select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ orderBy: vi.fn().mockResolvedValue([
          { name: 'Gold', minPoints: 500, multiplier: '1.5' }
        ]) }) })
      };

      (db.transaction as any).mockImplementationOnce(async (cb: any) => cb(mTx));

      const spyCheckLevelUp = vi.spyOn(LoyaltyEngine, 'checkLevelUp').mockResolvedValue();

      const newBalance = await LoyaltyEngine.addPoints('user-1', 100, 'earned_booking', 'Test Earn');

      expect(mTx.insert).toHaveBeenCalled();

      // Amount should be 100 * 1.5 = 150
      const insertCalls = (mTx.insert().values as any).mock.calls;
      expect(insertCalls[0][0].amount).toBe(150);

      expect(newBalance).toBe(1150); // 1000 + 150

      spyCheckLevelUp.mockRestore();
    });
  });

  describe('redeemReward', () => {
    it('should throw if reward not found', async () => {
      const mTx = {
        query: {
          rewards: { findFirst: vi.fn().mockResolvedValue(null) }
        }
      };
      (db.transaction as any).mockImplementationOnce(async (cb: any) => cb(mTx));

      await expect(LoyaltyEngine.redeemReward('user-1', 'rew-1')).rejects.toThrow('Reward not found');
    });

    it('should throw if reward is inactive', async () => {
      const mTx = {
        query: {
          rewards: { findFirst: vi.fn().mockResolvedValue({ id: 'rew-1', isActive: false }) }
        }
      };
      (db.transaction as any).mockImplementationOnce(async (cb: any) => cb(mTx));

      await expect(LoyaltyEngine.redeemReward('user-1', 'rew-1')).rejects.toThrow('Reward is inactive');
    });

    it('should throw if out of stock', async () => {
      const mTx = {
        query: {
          rewards: { findFirst: vi.fn().mockResolvedValue({ id: 'rew-1', isActive: true, quantity: 0 }) }
        }
      };
      (db.transaction as any).mockImplementationOnce(async (cb: any) => cb(mTx));

      await expect(LoyaltyEngine.redeemReward('user-1', 'rew-1')).rejects.toThrow('Reward out of stock');
    });

    it('should throw if insufficient points', async () => {
      const mTx = {
        query: {
          rewards: { findFirst: vi.fn().mockResolvedValue({ id: 'rew-1', isActive: true, quantity: 10, cost: 500 }) },
          users: { findFirst: vi.fn().mockResolvedValue({ id: 'user-1', loyaltyPoints: 200 }) }
        }
      };
      (db.transaction as any).mockImplementationOnce(async (cb: any) => cb(mTx));

      await expect(LoyaltyEngine.redeemReward('user-1', 'rew-1')).rejects.toThrow('Insufficient points');
    });

    it('should redeem successfully', async () => {
      const mTx = {
        query: {
          rewards: { findFirst: vi.fn().mockResolvedValue({ id: 'rew-1', isActive: true, quantity: 10, cost: 500, name: 'Discount' }) },
          users: { findFirst: vi.fn().mockResolvedValue({ id: 'user-1', loyaltyPoints: 600 }) }
        },
        insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue({}) }),
        update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue({}) }) })
      };
      (db.transaction as any).mockImplementationOnce(async (cb: any) => cb(mTx));

      const res = await LoyaltyEngine.redeemReward('user-1', 'rew-1');

      expect(res.pointsRemaining).toBe(100);
      expect(res.code).toBeDefined();
      expect(mTx.update).toHaveBeenCalled();
      expect(mTx.insert).toHaveBeenCalledTimes(2); // One for transaction log, one for userReward
    });
  });

  describe('checkLevelUp', () => {
    it('should award bonus points on level up', async () => {
       const txOrDbMock = {
         select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ orderBy: vi.fn().mockResolvedValue([
            { id: 'lvl-gold', name: 'Gold', minPoints: 500 }
         ]) }) }),
         query: {
            pointTransactions: { findFirst: vi.fn().mockResolvedValue(null) }
         },
         insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue({}) }),
         update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue({}) }) })
       };

       await LoyaltyEngine.checkLevelUp('user-1', 600, txOrDbMock);

       expect(txOrDbMock.insert).toHaveBeenCalled();

       // Gold bonus is 500
       const insertCalls = (txOrDbMock.insert().values as any).mock.calls;
       expect(insertCalls[0][0].amount).toBe(500);
       expect(insertCalls[0][0].type).toBe('bonus_level_up');

       expect(txOrDbMock.update).toHaveBeenCalled();
    });

    it('should not award if already awarded', async () => {
       const txOrDbMock = {
         select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ orderBy: vi.fn().mockResolvedValue([
            { id: 'lvl-gold', name: 'Gold', minPoints: 500 }
         ]) }) }),
         query: {
            pointTransactions: { findFirst: vi.fn().mockResolvedValue({ id: 'existing-tx' }) }
         },
         insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue({}) }),
         update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue({}) }) })
       };

       await LoyaltyEngine.checkLevelUp('user-1', 600, txOrDbMock);

       expect(txOrDbMock.insert).not.toHaveBeenCalled();
       expect(txOrDbMock.update).not.toHaveBeenCalled();
    });
  });
});
