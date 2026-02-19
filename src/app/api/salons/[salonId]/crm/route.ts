import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { clientProfiles, salons, serviceHistory, clientCommunications } from '@/db/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { headers } from 'next/headers';
import { startOfMonth, endOfMonth } from 'date-fns';

// GET /api/salons/[salonId]/crm - Get salon clients with CRM data
export async function GET(
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const isVip = searchParams.get('isVip');
    const minVisits = searchParams.get('minVisits');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query conditions
    let query = db.query.clientProfiles.findMany({
      where: eq(clientProfiles.salonId, salonId),
      with: {
        user: true,
        preferredStaff: true
      },
      orderBy: [desc(clientProfiles.lastVisitAt)],
      limit,
      offset: (page - 1) * limit
    });

    const clients = await query;

    // Get summary stats
    const totalClients = await db.query.clientProfiles.findMany({
      where: eq(clientProfiles.salonId, salonId)
    });

    const vipClients = totalClients.filter(c => c.isVIP).length;
    const totalVisits = totalClients.reduce((sum, c) => sum + c.totalVisits, 0);
    const totalRevenue = totalClients.reduce((sum, c) => sum + c.totalSpent, 0);

    // This month's stats
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    const thisMonthClients = totalClients.filter(c =>
      c.lastVisitAt && c.lastVisitAt >= monthStart && c.lastVisitAt <= monthEnd
    );

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total: totalClients.length
      },
      stats: {
        totalClients: totalClients.length,
        vipClients,
        totalVisits,
        totalRevenue,
        thisMonthVisits: thisMonthClients.length,
        thisMonthRevenue: thisMonthClients.reduce((sum, c) => sum + c.totalSpent, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching CRM data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
