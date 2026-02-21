import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { badges, userBadges } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { BadgeCollection } from "@/components/loyalty/BadgeCollection";
import { redirect } from "next/navigation";

export default async function AchievementsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const allBadges = await db.select().from(badges);
  const unlockedBadges = await db.select().from(userBadges).where(eq(userBadges.userId, session.user.id));

  const badgesWithStatus = allBadges.map(badge => {
    const unlocked = unlockedBadges.find(ub => ub.badgeId === badge.id);
    return {
        ...badge,
        isUnlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt || null
    };
  });

  // Sort: Unlocked first, then by rarity/points
  badgesWithStatus.sort((a, b) => {
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;
      return (b.pointsBonus || 0) - (a.pointsBonus || 0);
  });

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold">Your Achievements</h2>
            <p className="text-muted-foreground">Collect badges to earn bonus points and show off your status.</p>
        </div>

        <BadgeCollection badges={badgesWithStatus} />
    </div>
  );
}
