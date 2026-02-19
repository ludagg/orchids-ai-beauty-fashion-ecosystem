import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { staff, staffHours, salons } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';

// GET /api/staff/[staffId]/hours - Get staff working hours
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ staffId: string }> }
) {
  try {
    const { staffId } = await params;

    const hours = await db.query.staffHours.findMany({
      where: eq(staffHours.staffId, staffId),
      orderBy: (staffHours, { asc }) => [asc(staffHours.dayOfWeek)]
    });

    return NextResponse.json(hours);
  } catch (error) {
    console.error('Error fetching staff hours:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/staff/[staffId]/hours - Update staff working hours
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { staffId } = await params;

    // Get staff with salon info
    const staffMember = await db.query.staff.findFirst({
      where: eq(staff.id, staffId),
      with: {
        salon: true
      }
    });

    if (!staffMember) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Check if user is salon owner
    if (staffMember.salon.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { hours } = body; // Array of { dayOfWeek, openTime, closeTime, isClosed, breakStart, breakEnd }

    if (!Array.isArray(hours)) {
      return NextResponse.json({ error: 'Hours must be an array' }, { status: 400 });
    }

    // Update hours in transaction
    await db.transaction(async (tx) => {
      // Delete existing hours
      await tx.delete(staffHours).where(eq(staffHours.staffId, staffId));

      // Insert new hours
      for (const hour of hours) {
        await tx.insert(staffHours).values({
          id: nanoid(),
          staffId,
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isClosed: hour.isClosed || false,
          breakStart: hour.breakStart,
          breakEnd: hour.breakEnd
        });
      }
    });

    // Return updated hours
    const updatedHours = await db.query.staffHours.findMany({
      where: eq(staffHours.staffId, staffId),
      orderBy: (staffHours, { asc }) => [asc(staffHours.dayOfWeek)]
    });

    return NextResponse.json(updatedHours);
  } catch (error) {
    console.error('Error updating staff hours:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
