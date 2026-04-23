import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { bookings } from "@/db/schema/bookings";
import { users } from "@/db/schema/auth";
import { eq, sql, desc, and } from "drizzle-orm";
import CustomersClient from "./CustomersClient";
import { formatDistanceToNow } from "date-fns";

export default async function CustomersPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth");
  }

  // Get user's salon
  const userSalons = await db
    .select()
    .from(salons)
    .where(eq(salons.ownerId, session.user.id))
    .limit(1);

  if (userSalons.length === 0) {
    redirect("/business/register");
  }

  const salon = userSalons[0];

  // Fetch unique customers based on bookings
  const customersResult = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      image: users.image,
      totalVisits: sql<number>`count(${bookings.id})::int`,
      totalSpentCents: sql<number>`sum(${bookings.totalPrice})::int`,
      lastVisitDate: sql<Date>`max(${bookings.startTime})`
    })
    .from(bookings)
    .innerJoin(users, eq(bookings.userId, users.id))
    .where(
        and(
            eq(bookings.salonId, salon.id),
            eq(bookings.status, 'completed')
        )
    )
    .groupBy(users.id, users.name, users.email, users.phone, users.image)
    .orderBy(desc(sql`max(${bookings.startTime})`));

  // Transform data for the frontend
  const customers = customersResult.map(c => {
      let status = "New";
      if (c.totalVisits > 10 || c.totalSpentCents > 2000000) { // arbitrary VIP threshold
          status = "VIP";
      } else if (c.totalVisits > 1) {
          status = "Regular";
      }

      return {
          id: c.id,
          name: c.name || "Unknown User",
          email: c.email || "",
          phone: c.phone || "",
          lastVisit: c.lastVisitDate ? formatDistanceToNow(new Date(c.lastVisitDate), { addSuffix: true }) : "Never",
          totalVisits: c.totalVisits || 0,
          totalSpent: (c.totalSpentCents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
          image: c.image || "",
          status
      };
  });

  // Calculate summary stats
  const totalCustomers = customers.length;
  const vipCount = customers.filter(c => c.status === "VIP").length;
  // Calculate a mock growth percentage based on recent vs total
  const recentCustomers = customersResult.filter(c => {
      if (!c.lastVisitDate) return false;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(c.lastVisitDate) > thirtyDaysAgo;
  }).length;

  let growthPercentage = 0;
  if (totalCustomers > 0) {
       growthPercentage = Math.round((recentCustomers / totalCustomers) * 100);
  }

  const stats = {
      totalCustomers,
      vipCount,
      growthPercentage
  };

  return (
    <div className="space-y-8 bg-background p-6 lg:p-8 max-w-7xl mx-auto">
      <CustomersClient initialCustomers={customers} stats={stats} />
    </div>
  );
}
