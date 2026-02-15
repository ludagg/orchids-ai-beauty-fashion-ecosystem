import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, services } from '@/db/schema';
import { eq, and, gte, lt, or } from 'drizzle-orm';
import { addMinutes, startOfDay, endOfDay, format } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');
    const serviceId = searchParams.get('serviceId');
    const dateStr = searchParams.get('date');

    if (!salonId || !serviceId || !dateStr) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const date = new Date(dateStr);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    // 1. Get Service Duration
    const service = await db.query.services.findFirst({
      where: eq(services.id, serviceId),
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const duration = service.duration;

    // 2. Fetch Existing Bookings for that day
    const existingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.salonId, salonId),
        gte(bookings.startTime, dayStart),
        lt(bookings.startTime, dayEnd),
        or(
          eq(bookings.status, 'confirmed'),
          eq(bookings.status, 'pending')
        )
      ),
    });

    // 3. Generate Time Slots (9 AM to 9 PM)
    // TODO: Fetch real operating hours from Salon table when available
    const openTime = 9; // 9 AM
    const closeTime = 21; // 9 PM
    const interval = 30; // 30 mins slot interval

    const slots = [];
    let currentTime = new Date(dayStart);
    currentTime.setHours(openTime, 0, 0, 0);

    const endTime = new Date(dayStart);
    endTime.setHours(closeTime, 0, 0, 0);

    while (currentTime < endTime) {
      const slotStart = new Date(currentTime);
      const slotEnd = addMinutes(slotStart, duration);

      if (slotEnd <= endTime) {
        // Check for overlap
        const isOccupied = existingBookings.some(booking => {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(booking.endTime);
          return (
            (slotStart >= bookingStart && slotStart < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
          );
        });

        if (!isOccupied) {
          slots.push(format(slotStart, 'hh:mm a'));
        }
      }

      currentTime = addMinutes(currentTime, interval);
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
