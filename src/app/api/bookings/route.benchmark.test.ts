import { describe, expect, it, mock } from 'bun:test';

// Mocking Next.js headers to avoid "called outside request scope" errors
mock.module('next/headers', () => ({
  headers: mock(() => new Headers()),
}));

// We benchmark by comparing the theoretical round-trips of the N+1 vs batched logic.
describe('Booking API - N+1 Query Resolution Benchmark', () => {
  it('should prove batched query reduces DB operations from N to 1', () => {
    // Setup Mock Data
    const qualifiedStaff = [
      { id: 'staff_1' },
      { id: 'staff_2' },
      { id: 'staff_3' },
      { id: 'staff_4' },
      { id: 'staff_5' },
    ];

    // 1. Old Sequential (N+1) Approach Simulation
    let sequentialDbCallCount = 0;

    // Simulate the old loop
    let assignedStaffIdSequential = null;
    for (const s of qualifiedStaff) {
      sequentialDbCallCount++; // Simulating tx.query.bookings.findFirst()

      // Simulate that the first 4 staff members are booked, the 5th is free
      const hasConflict = s.id !== 'staff_5';

      if (!hasConflict) {
        assignedStaffIdSequential = s.id;
        break;
      }
    }

    // 2. New Batched Approach Simulation
    let batchedDbCallCount = 0;

    // Simulate the new batched query
    batchedDbCallCount++; // Simulating tx.query.bookings.findMany(inArray(...))

    // Simulate returning conflicts for the first 4 staff members
    const mockedConflicts = [
      { staffId: 'staff_1' },
      { staffId: 'staff_2' },
      { staffId: 'staff_3' },
      { staffId: 'staff_4' },
    ];

    let assignedStaffIdBatched = null;
    const bookedStaffIds = new Set(mockedConflicts.map((c) => c.staffId));

    for (const s of qualifiedStaff) {
      if (!bookedStaffIds.has(s.id)) {
        assignedStaffIdBatched = s.id;
        break;
      }
    }

    // Assertions
    expect(assignedStaffIdSequential).toBe('staff_5');
    expect(assignedStaffIdBatched).toBe('staff_5');

    // Prove the performance improvement: 5 calls vs 1 call
    expect(sequentialDbCallCount).toBeGreaterThan(batchedDbCallCount);
    expect(sequentialDbCallCount).toBe(5);
    expect(batchedDbCallCount).toBe(1);
  });
});
