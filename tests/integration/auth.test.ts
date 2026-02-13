import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { db as testDb } from '../test-db';
import { migrate } from 'drizzle-orm/pglite/migrator';

// Mock the global db instance
vi.mock('@/lib/db', async () => {
  const { db } = await import('../test-db');
  return { db };
});

import { db } from '@/lib/db';
import { users } from '@/db/schema';

describe('Auth Module', () => {
  beforeAll(async () => {
    // Run migrations on the test DB
    // Assuming 'drizzle' folder exists relative to cwd
    await migrate(testDb, { migrationsFolder: './drizzle' });
  });

  it('should create a new user', async () => {
    // Generate a unique ID
    const userId = `user-${Date.now()}`;

    const newUser = await db.insert(users).values({
      id: userId,
      name: 'Test User',
      email: `test-${userId}@example.com`,
      role: 'user',
    }).returning();

    expect(newUser[0].email).toBe(`test-${userId}@example.com`);

    // Verify persistence in the mocked db
    const fetched = await testDb.select().from(users).where(eq(users.id, userId));
    expect(fetched[0]).toBeDefined();
    expect(fetched[0].name).toBe('Test User');

    // Cleanup
    await db.delete(users).where(eq(users.id, userId));
  });
});
