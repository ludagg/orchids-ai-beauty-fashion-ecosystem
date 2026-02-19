import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { staff, salons, staffServices, services, staffHours } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';

// GET /api/salons/[salonId]/staff - List all staff for a salon
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const { salonId } = await params;

    // Get staff with their services and hours
    const staffList = await db.query.staff.findMany({
      where: eq(staff.salonId, salonId),
      with: {
        services: {
          with: {
            service: true
          }
        },
        hours: true
      },
      orderBy: (staff, { asc }) => [asc(staff.name)]
    });

    return NextResponse.json(staffList);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/salons/[salonId]/staff - Create a new staff member
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { salonId } = await params;

    // Check if user is salon owner
    const salon = await db.query.salons.findFirst({
      where: eq(salons.id, salonId)
    });

    if (!salon) {
      return NextResponse.json({ error: 'Salon not found' }, { status: 404 });
    }

    if (salon.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, role, bio, image, color, commissionRate, serviceIds } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const staffId = nanoid();

    // Create staff member in transaction
    await db.transaction(async (tx) => {
      // Create staff
      await tx.insert(staff).values({
        id: staffId,
        salonId,
        name,
        email,
        phone,
        role: role || 'stylist',
        bio,
        image,
        color: color || '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
        commissionRate: commissionRate || 0,
        isActive: true,
        canAcceptBookings: true
      });

      // Assign services if provided
      if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
        for (const serviceId of serviceIds) {
          await tx.insert(staffServices).values({
            id: nanoid(),
            staffId,
            serviceId,
            isPrimary: false
          });
        }
      }

      // Create default hours (copy from salon hours)
      const salonHours = await tx.query.openingHours.findMany({
        where: eq(services.id, salonId)
      });

      for (const hour of salonHours) {
        await tx.insert(staffHours).values({
          id: nanoid(),
          staffId,
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isClosed: hour.isClosed
        });
      }
    });

    // Return created staff with relations
    const createdStaff = await db.query.staff.findFirst({
      where: eq(staff.id, staffId),
      with: {
        services: {
          with: {
            service: true
          }
        },
        hours: true
      }
    });

    return NextResponse.json(createdStaff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
