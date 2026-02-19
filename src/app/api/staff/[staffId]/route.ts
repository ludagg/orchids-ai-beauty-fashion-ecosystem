import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { staff, salons, staffServices, staffHours } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';

// GET /api/staff/[staffId] - Get a specific staff member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const { staffId } = await params;

    const staffMember = await db.query.staff.findFirst({
      where: eq(staff.id, staffId),
      with: {
        services: {
          with: {
            service: true
          }
        },
        hours: true,
        timeOff: true,
        salon: true
      }
    });

    if (!staffMember) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    return NextResponse.json(staffMember);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/staff/[staffId] - Update a staff member
export async function PATCH(
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
    const { name, email, phone, role, bio, image, color, isActive, canAcceptBookings, commissionRate, serviceIds } = body;

    // Update staff in transaction
    await db.transaction(async (tx) => {
      // Update staff info
      await tx.update(staff)
        .set({
          name,
          email,
          phone,
          role,
          bio,
          image,
          color,
          isActive,
          canAcceptBookings,
          commissionRate,
          updatedAt: new Date()
        })
        .where(eq(staff.id, staffId));

      // Update services if provided
      if (serviceIds !== undefined) {
        // Remove existing services
        await tx.delete(staffServices)
          .where(eq(staffServices.staffId, staffId));

        // Add new services
        if (Array.isArray(serviceIds) && serviceIds.length > 0) {
          for (const serviceId of serviceIds) {
            await tx.insert(staffServices).values({
              id: nanoid(),
              staffId,
              serviceId,
              isPrimary: false
            });
          }
        }
      }
    });

    // Return updated staff with relations
    const updatedStaff = await db.query.staff.findFirst({
      where: eq(staff.id, staffId),
      with: {
        services: {
          with: {
            service: true
          }
        },
        hours: true,
        salon: true
      }
    });

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/staff/[staffId] - Delete a staff member
export async function DELETE(
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

    // Delete staff (cascade will handle related records)
    await db.delete(staff).where(eq(staff.id, staffId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
