import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({
  connectionString,
});

const db = drizzle(pool, { schema });

async function main() {
  const email = 'aggax27@gmail.com';
  console.log(`Checking user: ${email}`);

  // Use raw sql if possible or adjust to how drizzle is used in this project
  // Based on error, it seems drizzle-orm/node-postgres might be the issue if not installed or configured
  // But let's try to just run it. If module not found, I might need to install `pg` and `drizzle-orm` locally or check package.json

  try {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (!user) {
        console.error('User not found!');
        process.exit(1);
      }

      console.log(`Found user: ${user.name} (${user.id}). Current role: ${user.role}`);

      if (user.role === 'admin') {
        console.log('User is already an admin.');
        process.exit(0);
      }

      console.log('Updating role to admin...');
      await db.update(schema.users)
        .set({ role: 'admin' })
        .where(eq(schema.users.id, user.id));

      console.log('Success! User is now an admin.');
      process.exit(0);
  } catch (e) {
      console.error("Error executing:", e);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
