import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, services, openingHours, staff, staffHours, staffTimeOff } from '@/db/schema';
import { eq, and, gte, lt, or } from 'drizzle-orm';
import { addMinutes, startOfDay, endOfDay, format, getDay } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');
    const serviceId = searchParams.get('serviceId');
    const dateStr = searchParams.get('date');
    const staffId = searchParams.get('staffId'); // Optional: specific staff member

    if (!salonId || !serviceId || !dateStr) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fix Date Parsing: Force local interpretation of YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) {
        return NextResponse.json({ error: 'Invalid date format (YYYY-MM-DD)' }, { status: 400 });
    }
    const date = new Date(year, month - 1, day); // Local time midnight

    console.log(`Checking availability for Salon: ${salonId}, Service: ${serviceId}, Date: ${dateStr} (Day: ${getDay(date)})`);

    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const dayOfWeek = getDay(date); // 0 (Sunday) to 6 (Saturday)

    // 1. Get Service Duration
    const service = await db.query.services.findFirst({
      where: eq(services.id, serviceId),
    });

    if (!service) {
      console.error(`Service ${serviceId} not found`);
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
        console.log(`Salon closed or no hours for day ${dayOfWeek}`);
        return NextResponse.json([]);
    }

    // 3. If staffId specified, check staff availability
    let staffInfo = null;
    if (staffId) {
      staffInfo = await db.query.staff.findFirst({
        where: and(
          eq(staff.id, staffId),
          eq(staff.salonId, salonId),
          eq(staff.isActive, true),
          eq(staff.canAcceptBookings, true)
        )
      });

      if (!staffInfo) {
        return NextResponse.json({ error: 'Staff not found or unavailable' }, { status: 404 });
      }

      // Check if staff has time off
      const timeOff = await db.query.staffTimeOff.findMany({
        where: and(
          eq(staffTimeOff.staffId, staffId),
          eq(staffTimeOff.isApproved, true),
          gte(staffTimeOff.endDate, dayStart),
          lt(staffTimeOff.startDate, dayEnd)
        )
      });

      if (timeOff.length > 0) {
        return NextResponse.json([]); // Staff is on time off
      }
    }

    // 4. Fetch Existing Bookings for that day
    const bookingWhereConditions = [
      eq(bookings.salonId, salonId),
      gte(bookings.startTime, dayStart),
      lt(bookings.startTime, dayEnd),
      or(
        eq(bookings.status, 'confirmed'),
        eq(bookings.status, 'pending')
      )
    ];

    if (staffId) {
      bookingWhereConditions.push(eq(bookings.staffId, staffId));
    }

    const existingBookings = await db.query.bookings.findMany({
      where: and(...bookingWhereConditions),
    });

    // 5. Determine operating hours (staff hours override salon hours if specified)
    let operatingHours = {
      openTime: salonHours.openTime,
      closeTime: salonHours.closeTime
    };

    // Check for staff break time
    let breakTime = null;
    if (staffId) {
      const staffDayHours = await db.query.staffHours.findFirst({
        where: and(
          eq(staffHours.staffId, staffId),
          eq(staffHours.dayOfWeek, dayOfWeek)
        )
      });

      if (staffDayHours && !staffDayHours.isClosed) {
        operatingHours.openTime = staffDayHours.openTime || salonHours.openTime;
        operatingHours.closeTime = staffDayHours.closeTime || salonHours.closeTime;

        if (staffDayHours.breakStart && staffDayHours.breakEnd) {
          breakTime = {
            start: staffDayHours.breakStart,
            end: staffDayHours.breakEnd
          };
        }
      }
    }

    // 6. Generate Time Slots based on Operating Hours
    // Parse HH:MM string to hours and minutes
    const openTimeParts = operatingHours.openTime?.split(':').map(Number) || [9, 0];
    const closeTimeParts = operatingHours.closeTime?.split(':').map(Number) || [17, 0];

    if (openTimeParts.length !== 2 || closeTimeParts.length !== 2) {
         console.error(`Invalid time format for salon ${salonId}: ${operatingHours.openTime} - ${operatingHours.closeTime}`);
         return NextResponse.json([]);
    }

    const [openHour, openMinute] = openTimeParts;
    const [closeHour, closeMinute] = closeTimeParts;

    // Parse break time if exists
    let breakStart: Date | null = null;
    let breakEnd: Date | null = null;
    if (breakTime) {
      const [breakStartHour, breakStartMinute] = breakTime.start.split(':').map(Number);
      const [breakEndHour, breakEndMinute] = breakTime.end.split(':').map(Number);
      breakStart = new Date(date);
      breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);
      breakEnd = new Date(date);
      breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
    }

    const interval = 30; // 30 mins slot interval

    const slots = [];
    let currentTime = new Date(dayStart);
    currentTime.setHours(openHour, openMinute, 0, 0);

    const endTime = new Date(dayStart);
    endTime.setHours(closeHour, closeMinute, 0, 0);

    // If endTime is before startTime (e.g. open 10am close 9am), return empty.
    if (endTime <= currentTime) {
        console.log(`Invalid operating hours: Open ${operatingHours.openTime} - Close ${operatingHours.closeTime}`);
        return NextResponse.json([]);
    }

    while (currentTime < endTime) {
      const slotStart = new Date(currentTime);
      const slotEnd = addMinutes(slotStart, duration);

      // Ensure the service fits within the closing time
      if (slotEnd > endTime) {
        break;
      }

      // Check if during break time
      if (breakStart && breakEnd) {
        if (
          (slotStart >= breakStart && slotStart < breakEnd) ||
          (slotEnd > breakStart && slotEnd <= breakEnd) ||
          (slotStart <= breakStart && slotEnd >= breakEnd)
        ) {
          currentTime = addMinutes(currentTime, interval);
          continue;
        }
      }

      // Check for overlap with existing bookings
      const isOccupied = existingBookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        // Overlap logic: (StartA < EndB) and (EndA > StartB)
        return (slotStart < bookingEnd && slotEnd > bookingStart);
      });

      if (!isOccupied) {
        slots.push({
          time: format(slotStart, 'HH:mm'),
          displayTime: format(slotStart, 'h:mm a'),
          available: true
        });
      }

      currentTime = addMinutes(currentTime, interval);
    }

    return NextResponse.json({
      date: dateStr,
      staffId: staffId || null,
      staffName: staffInfo?.name || null,
      slots
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
