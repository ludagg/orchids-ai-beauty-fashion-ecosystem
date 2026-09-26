import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        height: true,
        weight: true,
        bodyType: true,
      },
    });

    if (!userProfile) {
       return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile);
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

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();

        const { height, weight, bodyType } = body;

        const updateData: { height?: string, weight?: string, bodyType?: string } = {};

        if (height !== undefined) updateData.height = height;
        if (weight !== undefined) updateData.weight = weight;
        if (bodyType !== undefined) updateData.bodyType = bodyType;

        const updatedUser = await db.update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning({
                height: users.height,
                weight: users.weight,
                bodyType: users.bodyType
            });

        if (!updatedUser.length) {
             return NextResponse.json({ error: 'Failed to update measurements' }, { status: 400 });
        }

        return NextResponse.json(updatedUser[0]);
    } catch (error) {
        console.error('Error updating measurements:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
