import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creators, videos, analytics } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const TEST_USER_ID = "user_123";

export async function GET() {
  try {
    // 1. Get Creator Profile
    const creator = await db.select().from(creators).where(eq(creators.userId, TEST_USER_ID)).limit(1);

    if (!creator.length) {
       return NextResponse.json({ isCreator: false });
    }

    const creatorId = creator[0].id;

    // 2. Aggregate Stats
    const videoStats = await db
      .select({
        totalViews: sql<number>`sum(${videos.views})`,
        totalLikes: sql<number>`sum(${videos.likes})`,
        count: sql<number>`count(*)`
      })
      .from(videos)
      .where(eq(videos.creatorId, creatorId));

    const analyticsData = await db
      .select()
      .from(analytics)
      .where(eq(analytics.creatorId, creatorId))
      .orderBy(analytics.date); // ascending

    // 3. Format Response
    const stats = {
      isCreator: true,
      totalViews: videoStats[0]?.totalViews || 0,
      totalEarnings: analyticsData.reduce((acc, curr) => acc + (curr.earnings || 0), 0),
      followers: 0, // No followers table yet, mocked
      activeVideos: videoStats[0]?.count || 0,
      chartData: analyticsData.map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        views: d.views,
        earnings: d.earnings
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
