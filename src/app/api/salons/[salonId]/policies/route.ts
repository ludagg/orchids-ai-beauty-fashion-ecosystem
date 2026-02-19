import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cancellationPolicies, salons, bookingReminders } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';

// GET /api/salons/[salonId]/policies - Get salon cancellation policy
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    const policy = await db.query.cancellationPolicies.findFirst({
      where: and(
        eq(cancellationPolicies.salonId, salonId),
        eq(cancellationPolicies.isActive, true)
      )
    });

    const reminders = await db.query.bookingReminders.findMany({
      where: and(
        eq(bookingReminders.salonId, salonId),
        eq(bookingReminders.isActive, true)
      ),
      orderBy: (bookingReminders, { asc }) => [asc(bookingReminders.hoursBefore)]
    });

    return NextResponse.json({
      policy: policy || null,
      reminders: reminders || []
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/salons/[salonId]/policies - Update salon cancellation policy
export async function PUT(
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
    const {
      policyType,
      freeCancellationHours,
      lateCancellationFee,
      noShowFee,
      customPolicyText,
      requireCard,
      requireDeposit,
      depositPercentage
    } = body;

    // Find existing policy or create new one
    const existingPolicy = await db.query.cancellationPolicies.findFirst({
      where: eq(cancellationPolicies.salonId, salonId)
    });

    let policy;
    if (existingPolicy) {
      // Update existing
      await db.update(cancellationPolicies)
        .set({
          policyType: policyType || 'moderate',
          freeCancellationHours: freeCancellationHours ?? 24,
          lateCancellationFee: lateCancellationFee ?? 50,
          noShowFee: noShowFee ?? 100,
          customPolicyText,
          requireCard: requireCard ?? false,
          requireDeposit: requireDeposit ?? false,
          depositPercentage: depositPercentage ?? 30,
          updatedAt: new Date()
        })
        .where(eq(cancellationPolicies.id, existingPolicy.id));

      policy = await db.query.cancellationPolicies.findFirst({
        where: eq(cancellationPolicies.id, existingPolicy.id)
      });
    } else {
      // Create new
      const policyId = nanoid();
      await db.insert(cancellationPolicies).values({
        id: policyId,
        salonId,
        policyType: policyType || 'moderate',
        freeCancellationHours: freeCancellationHours ?? 24,
        lateCancellationFee: lateCancellationFee ?? 50,
        noShowFee: noShowFee ?? 100,
        customPolicyText,
        requireCard: requireCard ?? false,
        requireDeposit: requireDeposit ?? false,
        depositPercentage: depositPercentage ?? 30,
        isActive: true
      });

      policy = await db.query.cancellationPolicies.findFirst({
        where: eq(cancellationPolicies.id, policyId)
      });
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error('Error updating policies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
