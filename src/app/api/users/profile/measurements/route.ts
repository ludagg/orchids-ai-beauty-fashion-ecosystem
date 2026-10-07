import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        height: true,
        weight: true,
        bodyType: true,
      }
    });

    return NextResponse.json({
        height: user?.height || '',
        weight: user?.weight || '',
        bodyType: user?.bodyType || '',
    });
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { height, weight, bodyType } = body;

        // Basic validation
        if (height && typeof height !== 'string') return NextResponse.json({ error: 'Invalid height' }, { status: 400 });
        if (weight && typeof weight !== 'string') return NextResponse.json({ error: 'Invalid weight' }, { status: 400 });
        if (bodyType && typeof bodyType !== 'string') return NextResponse.json({ error: 'Invalid body type' }, { status: 400 });

        await db.update(users)
            .set({
                ...(height !== undefined && { height }),
                ...(weight !== undefined && { weight }),
                ...(bodyType !== undefined && { bodyType }),
            })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating measurements:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
