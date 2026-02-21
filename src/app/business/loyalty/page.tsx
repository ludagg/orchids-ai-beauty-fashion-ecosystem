import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { salons, rewards } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { RewardsManager } from "./RewardsManager";

export default async function BusinessLoyaltyPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user || session.user.role !== 'salon_owner') {
    redirect("/auth");
  }

  const salon = await db.query.salons.findFirst({
      where: eq(salons.ownerId, session.user.id),
  });

  if (!salon) {
      return (
          <div className="p-8 text-center">
              <h1 className="text-2xl font-bold">No Salon Found</h1>
              <p>Please register your salon first.</p>
          </div>
      );
  }

  const salonRewards = await db.query.rewards.findMany({
      where: eq(rewards.salonId, salon.id),
      orderBy: [desc(rewards.createdAt)]
  });

  return (
    <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Loyalty Program</h1>
                <p className="text-muted-foreground">Manage rewards for your loyal customers.</p>
            </div>
        </div>

        <RewardsManager salonId={salon.id} initialRewards={salonRewards} />
    </div>
  );
}
