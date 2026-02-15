import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, services } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { salonId, serviceId, startTime, endTime, notes } = body;

    if (!salonId || !serviceId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch service to get current price
    const service = await db.query.services.findFirst({
      where: eq(services.id, serviceId),
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const bookingId = nanoid();

    await db.insert(bookings).values({
      id: bookingId,
      userId: session.user.id,
      salonId,
      serviceId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'pending',
      totalPrice: service.price, // Store snapshot of price
      notes,
    });

    return NextResponse.json({ success: true, bookingId });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userBookings = await db.query.bookings.findMany({
      where: eq(bookings.userId, session.user.id),
      with: {
        salon: true,
        service: true,
      },
      orderBy: [desc(bookings.startTime)],
    });

    return NextResponse.json(userBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
