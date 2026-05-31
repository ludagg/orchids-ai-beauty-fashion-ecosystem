import { vi, test, expect } from 'vitest';
vi.mock('drizzle-orm', () => {
    return {
        eq: vi.fn(),
    };
});
import { eq } from 'drizzle-orm';
test('mocking works', () => {
    expect(eq).toBeDefined();
});
