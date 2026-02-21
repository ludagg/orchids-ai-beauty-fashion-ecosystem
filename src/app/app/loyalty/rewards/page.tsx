import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { rewards, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { RewardsView } from "./RewardsView";
import { redirect } from "next/navigation";

export default async function RewardsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { loyaltyPoints: true }
  });

  const availableRewards = await db.query.rewards.findMany({
      where: eq(rewards.isActive, true),
      orderBy: [desc(rewards.createdAt)],
      with: {
          salon: {
              columns: {
                  name: true,
                  image: true
              }
          }
      },
      limit: 50
  });

  // Map to match Reward interface in RewardsView (mostly same)
  // Need to ensure types match or cast.
  // The query returns objects with optional fields.
  // RewardsView expects Reward[].
  // Drizzle result matches.

  return (
    <div className="space-y-6">
        <RewardsView
            initialRewards={availableRewards as any}
            userPoints={user?.loyaltyPoints || 0}
        />
    </div>
  );
}
