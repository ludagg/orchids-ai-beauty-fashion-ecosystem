import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, services, openingHours } from '@/db/schema';
import { eq, and, gte, lt, or } from 'drizzle-orm';
import { addMinutes, startOfDay, endOfDay, format, getDay } from 'date-fns';

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
    if (isNaN(date.getTime())) {
        return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const dayOfWeek = getDay(date); // 0 (Sunday) to 6 (Saturday)

    // 1. Get Service Duration
    const service = await db.query.services.findFirst({
      where: eq(services.id, serviceId),
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const duration = service.duration;

    // 2. Fetch Operating Hours for that day
    const salonHours = await db.query.openingHours.findFirst({
        where: and(
            eq(openingHours.salonId, salonId),
            eq(openingHours.dayOfWeek, dayOfWeek)
        )
    });

    // If no hours found or closed, return empty slots
    if (!salonHours || salonHours.isClosed || !salonHours.openTime || !salonHours.closeTime) {
        return NextResponse.json([]);
    }

    // 3. Fetch Existing Bookings for that day
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

    // 4. Generate Time Slots based on Operating Hours
    // Parse HH:MM string to hours and minutes
    const openTimeParts = salonHours.openTime.split(':').map(Number);
    const closeTimeParts = salonHours.closeTime.split(':').map(Number);

    if (openTimeParts.length !== 2 || closeTimeParts.length !== 2) {
         console.error(`Invalid time format for salon ${salonId}: ${salonHours.openTime} - ${salonHours.closeTime}`);
         return NextResponse.json([]);
    }

    const [openHour, openMinute] = openTimeParts;
    const [closeHour, closeMinute] = closeTimeParts;

    const interval = 30; // 30 mins slot interval

    const slots = [];
    let currentTime = new Date(dayStart);
    currentTime.setHours(openHour, openMinute, 0, 0);

    const endTime = new Date(dayStart);
    endTime.setHours(closeHour, closeMinute, 0, 0);

    // If the close time is past midnight (e.g. 02:00 next day), we'd need more complex logic.
    // For now, assuming standard day hours (e.g., 09:00 - 21:00).
    // If endTime is before startTime (e.g. open 10am close 9am), return empty.
    if (endTime <= currentTime) {
        return NextResponse.json([]);
    }

    while (currentTime < endTime) {
      const slotStart = new Date(currentTime);
      const slotEnd = addMinutes(slotStart, duration);

      // Ensure the service fits within the closing time
      if (slotEnd <= endTime) {
        // Check for overlap with existing bookings
        const isOccupied = existingBookings.some(booking => {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(booking.endTime);

          // Overlap logic: (StartA < EndB) and (EndA > StartB)
          return (slotStart < bookingEnd && slotEnd > bookingStart);
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
