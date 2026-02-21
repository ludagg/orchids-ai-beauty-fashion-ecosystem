import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { pointTransactions, users, userLevels } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { LevelProgress } from "@/components/loyalty/LevelProgress";
import { PointsHistory } from "@/components/loyalty/PointsHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function LoyaltyDashboard() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return null;
  }

  const userId = session.user.id;

  // Fetch data
  const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { loyaltyPoints: true }
  });

  const currentPoints = user?.loyaltyPoints || 0;

  const history = await db.query.pointTransactions.findMany({
      where: eq(pointTransactions.userId, userId),
      orderBy: [desc(pointTransactions.createdAt)],
      limit: 10
  });

  const allLevels = await db.query.userLevels.findMany({
      orderBy: [desc(userLevels.minPoints)]
  });

  const currentLevel = allLevels.find(l => l.minPoints <= currentPoints);
  const nextLevel = [...allLevels].reverse().find(l => l.minPoints > currentPoints);

  return (
    <div className="space-y-8">
      <Card>
          <CardHeader>
              <CardTitle>Your Level</CardTitle>
          </CardHeader>
          <CardContent>
              <LevelProgress
                  currentPoints={currentPoints}
                  currentLevel={currentLevel}
                  nextLevel={nextLevel}
              />
          </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
          <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Points History</CardTitle>
              </CardHeader>
              <CardContent>
                  <PointsHistory transactions={history} />
              </CardContent>
          </Card>

          <div className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Quick Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4">You have {currentPoints} points to spend!</p>
                      <Button asChild className="w-full">
                          <Link href="/app/loyalty/rewards">
                              Go to Rewards Shop <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                  </CardContent>
              </Card>

              <Card>
                   <CardHeader>
                      <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4">Unlock badges to earn bonus points.</p>
                      <Button variant="outline" asChild className="w-full">
                          <Link href="/app/loyalty/achievements">
                              View Achievements <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
