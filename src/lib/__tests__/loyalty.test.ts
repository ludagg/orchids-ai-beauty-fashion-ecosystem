import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoyaltyEngine } from '../loyalty';

const { mTx, mDb } = vi.hoisted(() => {
    const mTx = {
        query: {
            users: {
                findFirst: vi.fn(),
            },
            pointTransactions: {
                findFirst: vi.fn(),
            },
            rewards: {
                findFirst: vi.fn(),
            }
        },
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue(true),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(true),
    };

    const mDb = {
        transaction: vi.fn(async (cb) => cb(mTx)),
        query: mTx.query,
        select: mTx.select,
        insert: mTx.insert,
        update: mTx.update,
    };
    return { mTx, mDb };
});

vi.mock('@/lib/db', () => ({
    db: mDb
}));

describe('LoyaltyEngine', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mTx.orderBy.mockResolvedValue([]);
    });

    describe('addPoints', () => {
        it('should add points correctly without level multiplier', async () => {
            mTx.query.users.findFirst.mockResolvedValueOnce({ loyaltyPoints: 100 })
                .mockResolvedValueOnce({ loyaltyPoints: 100 });

            mTx.orderBy.mockResolvedValueOnce([]); // userLevels

            const newBalance = await LoyaltyEngine.addPoints('user-1', 50, 'test_earn', 'Test Earn');

            expect(mTx.insert).toHaveBeenCalledTimes(1); // pointTransactions
            expect(mTx.update).toHaveBeenCalledTimes(1); // users
            expect(newBalance).toBe(150);
        });

        it('should deduct points correctly for negative amount', async () => {
            mTx.query.users.findFirst.mockResolvedValueOnce({ loyaltyPoints: 100 });

            const newBalance = await LoyaltyEngine.addPoints('user-1', -50, 'test_spend', 'Test Spend');

            expect(mTx.insert).toHaveBeenCalledTimes(1);
            expect(mTx.update).toHaveBeenCalledTimes(1);
            expect(newBalance).toBe(50);
        });

        it('should throw error if user not found', async () => {
            mTx.query.users.findFirst.mockReset();
            mTx.query.users.findFirst.mockResolvedValue(null);

            await expect(LoyaltyEngine.addPoints('user-1', 50, 'test', 'Test')).rejects.toThrow("User not found");
        });
    });

    describe('checkLevelUp', () => {
        it('should award bonus if user reaches new level', async () => {
            const levels = [{ name: 'Silver', minPoints: 500, id: 'l1' }];
            mTx.orderBy.mockResolvedValueOnce(levels);
            mTx.query.pointTransactions.findFirst.mockResolvedValueOnce(null);

            await LoyaltyEngine.checkLevelUp('user-1', 600, mTx);

            expect(mTx.insert).toHaveBeenCalledTimes(1); // bonus transaction
            expect(mTx.update).toHaveBeenCalledTimes(1); // user balance update
        });

        it('should not award bonus if already awarded', async () => {
             const levels = [{ name: 'Silver', minPoints: 500, id: 'l1' }];
            mTx.orderBy.mockResolvedValueOnce(levels);
            mTx.query.pointTransactions.findFirst.mockResolvedValueOnce({ id: 'tx1' }); // existing bonus

            await LoyaltyEngine.checkLevelUp('user-1', 600, mTx);

            expect(mTx.insert).not.toHaveBeenCalled();
            expect(mTx.update).not.toHaveBeenCalled();
        });
    });

    describe('unlockBadge', () => {
        // Need to mock db.query.userBadges and db.query.badges specifically for this
        const mockDb = {
             query: {
                 userBadges: { findFirst: vi.fn() },
                 badges: { findFirst: vi.fn() }
             },
             transaction: vi.fn(async (cb) => cb(mTx))
        } as any;

        // Since LoyaltyEngine uses db directly, we'll temporarily override the mock behavior by changing the hoisted mock object's returns

        it('should unlock badge and add bonus points', async () => {
            mDb.query.userBadges = { findFirst: vi.fn().mockResolvedValue(null) };
            mDb.query.badges = { findFirst: vi.fn().mockResolvedValue({ id: 'b1', name: 'Badge', pointsBonus: 100 }) };

            // For addPoints inside unlockBadge
            mTx.query.users.findFirst.mockReset();
            mTx.query.users.findFirst.mockResolvedValue({ loyaltyPoints: 200 });

            const result = await LoyaltyEngine.unlockBadge('user-1', 'b1');

            expect(result).toBe(true);
            expect(mTx.insert).toHaveBeenCalled(); // userBadges insert
            // addPoints will also call insert for transaction
        });

        it('should return false if badge already unlocked', async () => {
            mDb.query.userBadges = { findFirst: vi.fn().mockResolvedValue({ id: 'ub1' }) };

            const result = await LoyaltyEngine.unlockBadge('user-1', 'b1');
            expect(result).toBe(false);
        });
    });

    describe('checkBadges', () => {
        it('should unlock First Booking badge on first booking', async () => {
             mDb.select.mockReturnThis();
             mDb.from = vi.fn().mockResolvedValue([
                 { id: 'b1', name: 'First Booking', condition: '{"type": "booking_completed"}' }
             ]);

             mDb.query.userBadges = { findFirst: vi.fn().mockResolvedValue(null) };
             mDb.query.badges = { findFirst: vi.fn().mockResolvedValue({ id: 'b1', name: 'First Booking', pointsBonus: 0 }) };

             await LoyaltyEngine.checkBadges('user-1', 'booking_completed', { isFirstBooking: true });

             expect(mDb.transaction).toHaveBeenCalled(); // via unlockBadge
        });

        it('should not unlock First Booking badge if not first booking', async () => {
             mDb.select.mockReturnThis();
             mDb.from = vi.fn().mockResolvedValue([
                 { id: 'b1', name: 'First Booking', condition: '{"type": "booking_completed"}' }
             ]);

             const unlockSpy = vi.spyOn(LoyaltyEngine, 'unlockBadge');

             await LoyaltyEngine.checkBadges('user-1', 'booking_completed', { isFirstBooking: false });

             expect(unlockSpy).not.toHaveBeenCalled();
        });
    });

    describe('redeemReward', () => {
        it('should deduct points and create user reward', async () => {
             mTx.query.rewards.findFirst.mockReset();
             mTx.query.users.findFirst.mockReset();
             mTx.query.rewards.findFirst.mockResolvedValue({ id: 'r1', isActive: true, quantity: 10, cost: 50, name: 'Reward' });
             mTx.query.users.findFirst.mockResolvedValue({ loyaltyPoints: 100 });

             const result = await LoyaltyEngine.redeemReward('user-1', 'r1');

             expect(result.pointsRemaining).toBe(50);
             expect(result.code).toBeDefined();
             expect(mTx.update).toHaveBeenCalledTimes(2); // users and rewards
             expect(mTx.insert).toHaveBeenCalledTimes(2); // pointTransactions and userRewards
        });

        it('should throw error if insufficient points', async () => {
             mTx.query.rewards.findFirst.mockResolvedValueOnce({ id: 'r1', isActive: true, quantity: 10, cost: 150 });
             mTx.query.users.findFirst.mockResolvedValueOnce({ loyaltyPoints: 100 });

             await expect(LoyaltyEngine.redeemReward('user-1', 'r1')).rejects.toThrow("Insufficient points");
        });

        it('should throw error if reward inactive', async () => {
             mTx.query.rewards.findFirst.mockResolvedValueOnce({ id: 'r1', isActive: false });

             await expect(LoyaltyEngine.redeemReward('user-1', 'r1')).rejects.toThrow("Reward is inactive");
        });

        it('should throw error if reward out of stock', async () => {
             mTx.query.rewards.findFirst.mockResolvedValueOnce({ id: 'r1', isActive: true, quantity: 0 });

             await expect(LoyaltyEngine.redeemReward('user-1', 'r1')).rejects.toThrow("Reward out of stock");
        });
    });
});
