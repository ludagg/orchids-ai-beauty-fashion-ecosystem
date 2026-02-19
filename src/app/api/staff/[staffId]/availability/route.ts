import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staff, staffHours, staffTimeOff, bookings } from '@/db/schema';
import { eq, and, gte, lt, or, ne } from 'drizzle-orm';
import { addMinutes, startOfDay, endOfDay, format, getDay, isWithinInterval, parseISO } from 'date-fns';

// GET /api/staff/[staffId]/availability?date=YYYY-MM-DD&serviceId=xxx
// Get available time slots for a specific staff member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ staffId: string }> }
) {
  try {
    const { staffId } = await params;
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const durationParam = searchParams.get('duration');

    if (!dateStr) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
    }

    // Fix Date Parsing: Force local interpretation of YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) {
      return NextResponse.json({ error: 'Invalid date format (YYYY-MM-DD)' }, { status: 400 });
    }
    const date = new Date(year, month - 1, day);

    // Get staff member
    const staffMember = await db.query.staff.findFirst({
      where: and(
        eq(staff.id, staffId),
        eq(staff.isActive, true),
        eq(staff.canAcceptBookings, true)
      ),
      with: {
        salon: true
      }
    });

    if (!staffMember) {
      return NextResponse.json({ error: 'Staff not found or unavailable' }, { status: 404 });
    }

    const dayOfWeek = getDay(date);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    // Check if staff has time off
    const timeOff = await db.query.staffTimeOff.findMany({
      where: and(
        eq(staffTimeOff.staffId, staffId),
        eq(staffTimeOff.isApproved, true),
        // Check if the date falls within any time off period
        gte(staffTimeOff.endDate, dayStart),
        lt(staffTimeOff.startDate, dayEnd)
      )
    });

    if (timeOff.length > 0) {
      return NextResponse.json([]); // Staff is on time off
    }

    // Get staff hours for this day
    const staffDayHours = await db.query.staffHours.findFirst({
      where: and(
        eq(staffHours.staffId, staffId),
        eq(staffHours.dayOfWeek, dayOfWeek)
      )
    });

    if (!staffDayHours || staffDayHours.isClosed) {
      return NextResponse.json([]); // Staff is closed this day
    }

    // Get service duration
    let duration = 30; // Default 30 min
    if (durationParam) {
      duration = parseInt(durationParam);
    } else if (serviceId) {
      const service = await db.query.services.findFirst({
        where: eq(services.id, serviceId)
      });
      if (service) {
        duration = service.duration;
      }
    }

    // Get existing bookings for this staff on this day
    const existingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.staffId, staffId),
        gte(bookings.startTime, dayStart),
        lt(bookings.startTime, dayEnd),
        or(
          eq(bookings.status, 'confirmed'),
          eq(bookings.status, 'pending')
        )
      )
    });

    // Parse hours
    const [openHour, openMinute] = staffDayHours.openTime?.split(':').map(Number) || [9, 0];
    const [closeHour, closeMinute] = staffDayHours.closeTime?.split(':').map(Number) || [17, 0];

    // Parse break time if exists
    let breakStart: Date | null = null;
    let breakEnd: Date | null = null;
    if (staffDayHours.breakStart && staffDayHours.breakEnd) {
      const [breakStartHour, breakStartMinute] = staffDayHours.breakStart.split(':').map(Number);
      const [breakEndHour, breakEndMinute] = staffDayHours.breakEnd.split(':').map(Number);
      breakStart = new Date(date);
      breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);
      breakEnd = new Date(date);
      breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
    }

    const openTime = new Date(date);
    openTime.setHours(openHour, openMinute, 0, 0);

    const closeTime = new Date(date);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    // Generate available slots
    const interval = 30; // 30 min intervals
    const slots = [];
    let currentTime = new Date(openTime);

    while (currentTime < closeTime) {
      const slotStart = new Date(currentTime);
      const slotEnd = addMinutes(slotStart, duration);

      // Check if slot fits within closing time
      if (slotEnd > closeTime) {
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

      // Check for conflicts with existing bookings
      const isOccupied = existingBookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
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
      staffId,
      staffName: staffMember.name,
      date: dateStr,
      slots
    });
  } catch (error) {
    console.error('Error checking staff availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Need to import services
import { services } from '@/db/schema';
