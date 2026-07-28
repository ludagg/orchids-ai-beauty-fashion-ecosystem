import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { height, weight, bodyType } = body;

    // Validate inputs (optional but good practice)
    if (height && typeof height !== 'string') return NextResponse.json({ error: 'Invalid height' }, { status: 400 });
    if (weight && typeof weight !== 'string') return NextResponse.json({ error: 'Invalid weight' }, { status: 400 });
    if (bodyType && typeof bodyType !== 'string') return NextResponse.json({ error: 'Invalid body type' }, { status: 400 });

    const updatedUser = await db
      .update(users)
      .set({
        height: height || null,
        weight: weight || null,
        bodyType: bodyType || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json({ user: updatedUser[0] });
  } catch (error) {
    console.error('Error updating user measurements:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
