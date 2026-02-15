import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, services } from '@/db/schema';
import { eq, desc, and, or, lt, gt } from 'drizzle-orm';
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

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return NextResponse.json({ error: 'Invalid time range' }, { status: 400 });
    }

    // Use a transaction to ensure atomicity and prevent double-booking
    const result = await db.transaction(async (tx) => {
      // 1. Fetch Service to get current price and validate existence
      const service = await tx.query.services.findFirst({
        where: eq(services.id, serviceId),
      });

      if (!service) {
        return { error: 'Service not found', status: 404 };
      }

      // 2. Check for overlapping bookings
      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      // Only check against 'pending' or 'confirmed' bookings
      const conflicts = await tx.query.bookings.findMany({
        where: and(
          eq(bookings.salonId, salonId),
          or(
            eq(bookings.status, 'pending'),
            eq(bookings.status, 'confirmed')
          ),
          lt(bookings.startTime, end),
          gt(bookings.endTime, start)
        ),
      });

      if (conflicts.length > 0) {
        return { error: 'This time slot is already booked', status: 409 };
      }

      // 3. Create Booking
      const bookingId = nanoid();
      await tx.insert(bookings).values({
        id: bookingId,
        userId: session.user.id,
        salonId,
        serviceId,
        startTime: start,
        endTime: end,
        status: 'pending',
        totalPrice: service.price, // Store snapshot of price
        notes,
      });

      return { success: true, bookingId };
    });

    if ('error' in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result);
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
