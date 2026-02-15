import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, salons } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(
  req: Request,
  { params }: { params: { salonId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { salonId } = await params;

    const salon = await db.query.salons.findFirst({
      where: eq(salons.id, salonId),
      columns: {
        ownerId: true,
      },
    });

    if (!salon) {
      return NextResponse.json({ error: 'Salon not found' }, { status: 404 });
    }

    if (salon.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const salonBookings = await db.query.bookings.findMany({
      where: eq(bookings.salonId, salonId),
      with: {
        user: true,
        service: true,
      },
      orderBy: [desc(bookings.startTime)],
    });

    return NextResponse.json(salonBookings);
  } catch (error) {
    console.error('Error fetching salon bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
