import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { clientProfiles, salons, serviceHistory, clientCommunications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';

// GET /api/salons/[salonId]/crm/[clientId] - Get detailed client profile
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string; clientId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { salonId, clientId } = await params;

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

    const client = await db.query.clientProfiles.findFirst({
      where: and(
        eq(clientProfiles.id, clientId),
        eq(clientProfiles.salonId, salonId)
      ),
      with: {
        user: true,
        preferredStaff: true,
        serviceHistory: {
          orderBy: [desc(serviceHistory.date)],
          limit: 10
        },
        communications: {
          orderBy: [desc(clientCommunications.createdAt)],
          limit: 10,
          with: {
            staff: true
          }
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/salons/[salonId]/crm/[clientId] - Update client profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string; clientId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { salonId, clientId } = await params;

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
    const {
      notes,
      allergies,
      preferences,
      birthday,
      tags,
      isVIP,
      preferredStaffId
    } = body;

    await db.update(clientProfiles)
      .set({
        notes,
        allergies,
        preferences,
        birthday: birthday ? new Date(birthday) : undefined,
        tags,
        isVIP,
        preferredStaffId,
        updatedAt: new Date()
      })
      .where(and(
        eq(clientProfiles.id, clientId),
        eq(clientProfiles.salonId, salonId)
      ));

    const updatedClient = await db.query.clientProfiles.findFirst({
      where: eq(clientProfiles.id, clientId),
      with: {
        user: true,
        preferredStaff: true
      }
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/salons/[salonId]/crm/[clientId]/notes - Add service history note
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string; clientId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { salonId, clientId } = await params;

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
    const {
      serviceName,
      staffName,
      date,
      price,
      duration,
      notes,
      productsUsed,
      formulas
    } = body;

    if (!serviceName || !staffName || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const historyId = nanoid();
    await db.insert(serviceHistory).values({
      id: historyId,
      clientProfileId: clientId,
      serviceName,
      staffName,
      date: new Date(date),
      price,
      duration,
      notes,
      productsUsed: productsUsed || [],
      formulas
    });

    // Update client total spent
    const client = await db.query.clientProfiles.findFirst({
      where: eq(clientProfiles.id, clientId)
    });

    if (client && price) {
      await db.update(clientProfiles)
        .set({
          totalSpent: client.totalSpent + price,
          updatedAt: new Date()
        })
        .where(eq(clientProfiles.id, clientId));
    }

    const historyEntry = await db.query.serviceHistory.findFirst({
      where: eq(serviceHistory.id, historyId)
    });

    return NextResponse.json(historyEntry, { status: 201 });
  } catch (error) {
    console.error('Error adding service history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
