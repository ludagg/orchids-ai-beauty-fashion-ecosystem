import { describe, it, expect, mock, spyOn } from 'bun:test';
import { LoyaltyEngine } from './loyalty';

mock.module('@/lib/db', () => {
    return {
        db: {
            transaction: mock(async (cb: any) => {
                const mockTx = {
                    insert: mock(() => ({ values: mock(async () => [{ id: 'mock-tx-id' }]) })),
                    update: mock(() => ({ set: mock(() => ({ where: mock(async () => true) })) })),
                    select: mock(() => ({
                        from: mock(() => ({
                            orderBy: mock(async () => [
                                { id: '1', name: 'Bronze', minPoints: 0, multiplier: '1.0' },
                                { id: '2', name: 'Silver', minPoints: 500, multiplier: '1.5' },
                                { id: '3', name: 'Gold', minPoints: 2000, multiplier: '2.0' }
                            ])
                        }))
                    })),
                    query: {
                        users: {
                            findFirst: mock(async () => ({ id: 'user-1', loyaltyPoints: 500 })) // Silver
                        },
                        pointTransactions: {
                            findFirst: mock(async () => null)
                        }
                    }
                };
                return cb(mockTx);
            })
        }
    };
});

describe('LoyaltyEngine', () => {
    it('should properly check for level ups and award bonus points', async () => {
        const mockInsertValues = mock(async () => true);
        const mockUpdateWhere = mock(async () => true);
        const mockInsert = mock(() => ({ values: mockInsertValues }));
        const mockUpdate = mock(() => ({ set: mock(() => ({ where: mockUpdateWhere })) }));

        const mockTx = {
            select: mock(() => ({
                from: mock(() => ({
                    orderBy: mock(async () => [
                        { id: '1', name: 'Bronze', minPoints: 0, multiplier: '1.0' },
                        { id: '2', name: 'Silver', minPoints: 500, multiplier: '1.5' },
                        { id: '3', name: 'Gold', minPoints: 2000, multiplier: '2.0' }
                    ])
                }))
            })),
            query: {
                pointTransactions: {
                    findFirst: mock(async () => null) // no existing bonus
                }
            },
            insert: mockInsert,
            update: mockUpdate
        };

        // We check if reaching 500 points (Silver) awards the 250 bonus points
        await LoyaltyEngine.checkLevelUp('user-1', 500, mockTx);

        // The mock insert should have been called for the bonus point transaction
        expect(mockInsert).toHaveBeenCalled();
        expect(mockInsertValues).toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalled();
        expect(mockUpdateWhere).toHaveBeenCalled();
    });

    it('should not award bonus points if already awarded', async () => {
        const mockInsert = mock(() => ({ values: mock(async () => true) }));
        const mockUpdate = mock(() => ({ set: mock(() => ({ where: mock(async () => true) })) }));

        const mockTx = {
            select: mock(() => ({
                from: mock(() => ({
                    orderBy: mock(async () => [
                        { id: '1', name: 'Bronze', minPoints: 0, multiplier: '1.0' },
                        { id: '2', name: 'Silver', minPoints: 500, multiplier: '1.5' },
                        { id: '3', name: 'Gold', minPoints: 2000, multiplier: '2.0' }
                    ])
                }))
            })),
            query: {
                pointTransactions: {
                    findFirst: mock(async () => ({ id: 'existing-bonus-id' })) // User already has bonus
                }
            },
            insert: mockInsert,
            update: mockUpdate
        };

        await LoyaltyEngine.checkLevelUp('user-1', 500, mockTx);

        expect(mockInsert).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
    });
});
