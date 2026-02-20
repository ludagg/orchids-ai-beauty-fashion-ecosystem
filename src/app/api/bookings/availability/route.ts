import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, services, openingHours, staff, staffServices } from '@/db/schema';
import { eq, and, gte, lt, or, inArray } from 'drizzle-orm';
import { addMinutes, startOfDay, endOfDay, format, getDay } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');
    const serviceId = searchParams.get('serviceId');
    const staffIdParam = searchParams.get('staffId'); // Optional
    const dateStr = searchParams.get('date');

    if (!salonId || !serviceId || !dateStr) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fix Date Parsing
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) {
        return NextResponse.json({ error: 'Invalid date format (YYYY-MM-DD)' }, { status: 400 });
    }
    const date = new Date(year, month - 1, day);

    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const dayOfWeek = getDay(date);

    // 1. Get Service Duration
    const service = await db.query.services.findFirst({
      where: eq(services.id, serviceId),
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const duration = service.duration;

    // 2. Fetch Operating Hours
    const salonHours = await db.query.openingHours.findFirst({
        where: and(
            eq(openingHours.salonId, salonId),
            eq(openingHours.dayOfWeek, dayOfWeek)
        )
    });

    if (!salonHours || salonHours.isClosed || !salonHours.openTime || !salonHours.closeTime) {
        return NextResponse.json([]);
    }

    // 3. Identify Relevant Staff
    let targetStaffIds: string[] = [];

    if (staffIdParam && staffIdParam !== 'null') {
        // Specific staff selected
        targetStaffIds = [staffIdParam];
    } else {
        // "Any" selected: Get all staff performing this service
        const qualifiedStaff = await db
            .select({ id: staff.id })
            .from(staff)
            .innerJoin(staffServices, eq(staff.id, staffServices.staffId))
            .where(and(
                eq(staff.salonId, salonId),
                eq(staff.isActive, true),
                eq(staffServices.serviceId, serviceId)
            ));

        targetStaffIds = qualifiedStaff.map(s => s.id);
    }

    if (targetStaffIds.length === 0) {
        return NextResponse.json([]); // No staff available to perform service
    }

    // 4. Fetch Existing Bookings for Relevant Staff
    const existingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.salonId, salonId),
        inArray(bookings.staffId, targetStaffIds), // Only check relevant staff
        gte(bookings.startTime, dayStart),
        lt(bookings.startTime, dayEnd),
        or(
          eq(bookings.status, 'confirmed'),
          eq(bookings.status, 'pending')
        )
      ),
    });

    // 5. Generate Time Slots
    const openTimeParts = salonHours.openTime.split(':').map(Number);
    const closeTimeParts = salonHours.closeTime.split(':').map(Number);
    const [openHour, openMinute] = openTimeParts;
    const [closeHour, closeMinute] = closeTimeParts;

    const interval = 30;
    const slots: string[] = [];
    let currentTime = new Date(dayStart);
    currentTime.setHours(openHour, openMinute, 0, 0);

    const endTime = new Date(dayStart);
    endTime.setHours(closeHour, closeMinute, 0, 0);

    if (endTime <= currentTime) return NextResponse.json([]);

    while (currentTime < endTime) {
      const slotStart = new Date(currentTime);
      const slotEnd = addMinutes(slotStart, duration);

      if (slotEnd <= endTime) {
        // Check availability
        // If specific staff: specific staff must be free.
        // If any staff: AT LEAST ONE staff member must be free.

        let isSlotAvailable = false;

        for (const sId of targetStaffIds) {
            // Check if this specific staff member has an overlap
            const isStaffOccupied = existingBookings.some(booking => {
                if (booking.staffId !== sId) return false;
                const bookingStart = new Date(booking.startTime);
                const bookingEnd = new Date(booking.endTime);
                return (slotStart < bookingEnd && slotEnd > bookingStart);
            });

            if (!isStaffOccupied) {
                isSlotAvailable = true;
                break; // Found one available staff member, so the slot is open
            }
        }

        if (isSlotAvailable) {
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
