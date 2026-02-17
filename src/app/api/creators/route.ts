import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { videos } from "@/db/schema/content";
import { eq, desc, count, inArray, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const topCreators = await db.select({
            userId: videos.userId,
            videoCount: count(videos.id),
        })
        .from(videos)
        .groupBy(videos.userId)
        .orderBy(desc(count(videos.id)))
        .limit(10);

        if (topCreators.length === 0) {
            return NextResponse.json([]);
        }

        const userIds = topCreators.map(c => c.userId);

        const creators = await db.query.users.findMany({
            where: inArray(users.id, userIds),
        });

        const creatorsWithStatus = await Promise.all(creators.map(async (creator) => {
            const liveVideo = await db.query.videos.findFirst({
                where: and(eq(videos.userId, creator.id), eq(videos.isLive, true))
            });
            return {
                id: creator.id,
                name: creator.name,
                avatar: creator.image,
                isLive: !!liveVideo
            };
        }));

        // Sort by live first, then by video count (original order)
        const sortedCreators = creatorsWithStatus.sort((a, b) => {
            if (a.isLive && !b.isLive) return -1;
            if (!a.isLive && b.isLive) return 1;

            const indexA = userIds.indexOf(a.id);
            const indexB = userIds.indexOf(b.id);
            return indexA - indexB;
        });

        return NextResponse.json(sortedCreators);

    } catch (error) {
        console.error("Error fetching creators:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
