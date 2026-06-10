import { expect, test, describe, vi, beforeEach } from 'vitest';

// We must use vi.hoisted or define inside the mock
const { mTx, mDb } = vi.hoisted(() => {
    const mTx = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue([{ id: 'mock-id' }]),
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockResolvedValue([]), // Return array by default
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        query: {
            users: {
                findFirst: vi.fn(),
            },
            pointTransactions: {
                findFirst: vi.fn(),
                findMany: vi.fn(),
            },
            badges: {
                findFirst: vi.fn(),
                findMany: vi.fn(),
            },
            userBadges: {
                findFirst: vi.fn(),
                findMany: vi.fn(),
            },
            rewards: {
                findFirst: vi.fn(),
                findMany: vi.fn(),
            }
        }
    };

    const mDb = {
        transaction: vi.fn(async (cb) => cb(mTx)),
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockResolvedValue([]), // Return array by default for "await db.select().from(badges)"
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue([{ id: 'mock-id' }]),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        query: {
            users: {
                findFirst: vi.fn(),
            },
            pointTransactions: {
                findFirst: vi.fn(),
                findMany: vi.fn(),
            },
            badges: {
                findFirst: vi.fn(),
                findMany: vi.fn(),
            },
            userBadges: {
                findFirst: vi.fn(),
                findMany: vi.fn(),
            },
            rewards: {
                findFirst: vi.fn(),
                findMany: vi.fn(),
            }
        }
    };

    return { mTx, mDb };
});

vi.mock('@/lib/db', () => ({
    db: mDb
}));

// Mock nanoid
vi.mock('nanoid', () => ({
    nanoid: () => 'mock-id',
    customAlphabet: () => () => 'MOCKCODE12',
}));

import { LoyaltyEngine } from './loyalty';

describe('LoyaltyEngine', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addPoints', () => {
        test('should add points and apply multiplier if level exists', async () => {
            mTx.query.users.findFirst
                .mockResolvedValueOnce({ loyaltyPoints: 100 }) // for level check
                .mockResolvedValueOnce({ loyaltyPoints: 100 }); // for balance update

            // mTx.select().from().orderBy() returns
            mTx.orderBy.mockResolvedValueOnce([{ minPoints: 50, multiplier: '1.5' }]);

            mTx.from.mockReturnValueOnce(mTx); // Fix chain for select().from().orderBy()
            mTx.select.mockReturnValueOnce(mTx);

            // Mock checkLevelUp behavior via db mock (since checkLevelUp is called inside addPoints)
            const checkLevelUpSpy = vi.spyOn(LoyaltyEngine, 'checkLevelUp').mockResolvedValue(undefined);

            const result = await LoyaltyEngine.addPoints('user1', 100, 'earned_booking', 'Booking Points');

            // 100 * 1.5 = 150 points added to 100 current points -> 250
            expect(result).toBe(250);
            expect(mTx.insert).toHaveBeenCalled();
            expect(mTx.update).toHaveBeenCalled();
            expect(mTx.set).toHaveBeenCalledWith({ loyaltyPoints: 250 });

            checkLevelUpSpy.mockRestore();
        });

        test('should throw error if user not found', async () => {
            mTx.query.users.findFirst
                .mockResolvedValueOnce(null) // for level check
                .mockResolvedValueOnce(null); // for balance update (fails here)

            await expect(LoyaltyEngine.addPoints('user1', 100, 'earned_booking', 'Booking Points'))
                .rejects.toThrow("User not found");
        });
    });

    describe('checkLevelUp', () => {
        test('should award bonus if new level is reached and no bonus exists', async () => {
            mDb.orderBy.mockResolvedValueOnce([{ id: 'lvl1', name: 'Gold', minPoints: 500 }]);
            mDb.from.mockReturnValueOnce(mDb);
            mDb.select.mockReturnValueOnce(mDb);

            mDb.query.pointTransactions.findFirst.mockResolvedValueOnce(null); // no existing bonus

            await LoyaltyEngine.checkLevelUp('user1', 600);

            // Expect bonus point mapping 'Gold' -> 500
            expect(mDb.insert).toHaveBeenCalled();
            expect(mDb.update).toHaveBeenCalled();
            expect(mDb.set).toHaveBeenCalledWith({ loyaltyPoints: 1100 }); // 600 + 500 bonus
        });

        test('should not award bonus if already exists', async () => {
            mDb.orderBy.mockResolvedValueOnce([{ id: 'lvl1', name: 'Gold', minPoints: 500 }]);
            mDb.from.mockReturnValueOnce(mDb);
            mDb.select.mockReturnValueOnce(mDb);

            mDb.query.pointTransactions.findFirst.mockResolvedValueOnce({ id: 'existing' }); // existing bonus

            await LoyaltyEngine.checkLevelUp('user1', 600);

            expect(mDb.insert).not.toHaveBeenCalled();
            expect(mDb.update).not.toHaveBeenCalled();
        });
    });

    describe('unlockBadge', () => {
        test('should return false if already unlocked', async () => {
            mDb.query.userBadges.findFirst.mockResolvedValueOnce({ id: 'existing' });

            const result = await LoyaltyEngine.unlockBadge('user1', 'badge1');
            expect(result).toBe(false);
            expect(mDb.query.badges.findFirst).not.toHaveBeenCalled();
        });

        test('should unlock badge and award points if valid', async () => {
            mDb.query.userBadges.findFirst.mockResolvedValueOnce(null);
            mDb.query.badges.findFirst.mockResolvedValueOnce({ id: 'badge1', name: 'First Booking', pointsBonus: 50 });

            const addPointsSpy = vi.spyOn(LoyaltyEngine, 'addPoints').mockResolvedValue(150);

            const result = await LoyaltyEngine.unlockBadge('user1', 'badge1');

            expect(result).toBe(true);
            expect(mTx.insert).toHaveBeenCalled();
            expect(addPointsSpy).toHaveBeenCalledWith('user1', 50, 'bonus_badge', 'Unlocked Badge: First Booking', 'badge1');

            addPointsSpy.mockRestore();
        });
    });

    describe('checkBadges', () => {
        test('should check logic and unlock qualified badges', async () => {
            // Need to mock db.select().from() to return the array directly
            mDb.from.mockResolvedValueOnce([
                { id: 'b1', name: 'First Booking', condition: '{"type":"booking_completed"}' },
                { id: 'b2', name: 'Review Master', condition: '{"type":"review_created","min":5}' },
                { id: 'b3', name: 'Photo Master', condition: '{"type":"review_created","min":5}' }
            ]);

            const unlockSpy = vi.spyOn(LoyaltyEngine, 'unlockBadge').mockResolvedValue(true);

            // Trigger booking completed, should match 'First Booking'
            await LoyaltyEngine.checkBadges('user1', 'booking_completed', { isFirstBooking: true });

            expect(unlockSpy).toHaveBeenCalledWith('user1', 'b1');

            unlockSpy.mockClear();

            // Setup mock for next call
            mDb.from.mockResolvedValueOnce([
                { id: 'b1', name: 'First Booking', condition: '{"type":"booking_completed"}' },
                { id: 'b2', name: 'Review Master', condition: '{"type":"review_created","min":5}' },
                { id: 'b3', name: 'Photo Master', condition: '{"type":"review_created","min":5}' }
            ]);

            // Trigger review created with conditions
            await LoyaltyEngine.checkBadges('user1', 'review_created', { reviewCount: 5, hasPhotos: true, photoReviewCount: 5 });

            expect(unlockSpy).toHaveBeenCalledWith('user1', 'b2');
            expect(unlockSpy).toHaveBeenCalledWith('user1', 'b3');

            unlockSpy.mockRestore();
        });
    });

    describe('redeemReward', () => {
        test('should successfully redeem reward and update balance', async () => {
            mTx.query.rewards.findFirst.mockResolvedValueOnce({
                id: 'r1', name: 'Free Haircut', isActive: true, quantity: 10, cost: 500
            });
            mTx.query.users.findFirst.mockResolvedValueOnce({
                id: 'user1', loyaltyPoints: 1000
            });

            const result = await LoyaltyEngine.redeemReward('user1', 'r1');

            expect(result.code).toBe('MOCKCODE12');
            expect(result.pointsRemaining).toBe(500); // 1000 - 500

            // Deduct points
            expect(mTx.update).toHaveBeenCalled();
            expect(mTx.set).toHaveBeenCalledWith({ loyaltyPoints: 500 });

            // Create user reward code
            expect(mTx.insert).toHaveBeenCalled();

            // Deduct quantity
            expect(mTx.set).toHaveBeenCalledWith({ quantity: 9 });
        });

        test('should throw if reward not found', async () => {
            mTx.query.rewards.findFirst.mockResolvedValueOnce(null);

            await expect(LoyaltyEngine.redeemReward('user1', 'invalid'))
                .rejects.toThrow("Reward not found");
        });

        test('should throw if insufficient points', async () => {
            mTx.query.rewards.findFirst.mockResolvedValueOnce({
                id: 'r1', name: 'Free Haircut', isActive: true, quantity: 10, cost: 500
            });
            mTx.query.users.findFirst.mockResolvedValueOnce({
                id: 'user1', loyaltyPoints: 100 // < 500
            });

            await expect(LoyaltyEngine.redeemReward('user1', 'r1'))
                .rejects.toThrow("Insufficient points");
        });
    });

    describe('getUserLevel', () => {
        test('should return current user level', async () => {
            mDb.query.users.findFirst.mockResolvedValueOnce({ loyaltyPoints: 600 });

            mDb.orderBy.mockResolvedValueOnce([
                { id: 'l3', minPoints: 1000 },
                { id: 'l2', minPoints: 500 },
                { id: 'l1', minPoints: 0 }
            ]);
            mDb.from.mockReturnValueOnce(mDb);
            mDb.select.mockReturnValueOnce(mDb);

            const level = await LoyaltyEngine.getUserLevel('user1');
            expect(level?.id).toBe('l2');
        });

        test('should return null if user not found', async () => {
            mDb.query.users.findFirst.mockResolvedValueOnce(null);
            const level = await LoyaltyEngine.getUserLevel('unknown');
            expect(level).toBeNull();
        });
    });
});
