import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { bookings } from "@/db/schema/bookings";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import BusinessDashboardStats from "@/components/business/BusinessDashboardStats";

export default async function BusinessDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth");
  }

  // Fetch User's Salon
  const userSalons = await db
    .select()
    .from(salons)
    .where(eq(salons.ownerId, session.user.id))
    .limit(1);

  if (userSalons.length === 0) {
    redirect("/business/register");
  }

  const salon = userSalons[0];

  // Fetch Stats
  // 1. Revenue (Completed bookings)
  const revenueResult = await db
    .select({
      total: sql<number>`sum(${bookings.totalPrice})`
    })
    .from(bookings)
    .where(and(eq(bookings.salonId, salon.id), eq(bookings.status, 'completed')));

  const revenue = revenueResult[0]?.total || 0;

  // 2. Pending Requests
  const pendingResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(and(eq(bookings.salonId, salon.id), eq(bookings.status, 'pending')));

  const pending = pendingResult[0]?.count || 0;

  // 3. Upcoming Confirmed
  const upcomingResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(and(
        eq(bookings.salonId, salon.id),
        eq(bookings.status, 'confirmed'),
        gte(bookings.startTime, new Date())
    ));

  const upcoming = upcomingResult[0]?.count || 0;

  // 4. Total Customers (Approximate by unique bookings for now or just count all bookings? Better: distinct user_id)
  const customersResult = await db
    .select({ count: sql<number>`count(distinct ${bookings.userId})` })
    .from(bookings)
    .where(eq(bookings.salonId, salon.id));

  const customers = customersResult[0]?.count || 0;

  // Fetch Upcoming Bookings for List
  const upcomingList = await db.query.bookings.findMany({
    where: and(
        eq(bookings.salonId, salon.id),
        eq(bookings.status, 'confirmed'),
        gte(bookings.startTime, new Date())
    ),
    limit: 5,
    orderBy: [desc(bookings.startTime)],
    with: {
        user: true,
        service: true
    }
  });

  // Transform for component
  const upcomingBookings = upcomingList.map(b => ({
      id: b.id,
      user: {
          name: b.user.name,
          image: b.user.image,
          email: b.user.email
      },
      service: {
          name: b.service.name
      },
      startTime: b.startTime,
      status: b.status
  }));

  const stats = {
      revenue,
      pending,
      upcoming,
      customers
  };

  return (
    <BusinessDashboardStats
        stats={stats}
        upcomingBookings={upcomingBookings}
        salonName={salon.name}
        isPending={salon.status === 'pending'}
    />
  );
}
