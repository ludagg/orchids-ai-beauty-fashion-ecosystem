import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videos, videoLikes } from "@/db/schema/content";
import { headers } from "next/headers";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const videoId = id;

        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Toggle like
        const existingLike = await db.query.videoLikes.findFirst({
            where: and(
                eq(videoLikes.userId, session.user.id),
                eq(videoLikes.videoId, videoId)
            )
        });

        if (existingLike) {
            // Unlike
            await db.delete(videoLikes).where(
                 and(
                    eq(videoLikes.userId, session.user.id),
                    eq(videoLikes.videoId, videoId)
                )
            );
            // Decrement count
            await db.update(videos)
                .set({ likes: sql`${videos.likes} - 1` })
                .where(eq(videos.id, videoId));

            return NextResponse.json({ liked: false });
        } else {
            // Like
            await db.insert(videoLikes).values({
                id: nanoid(),
                userId: session.user.id,
                videoId: videoId
            });
            // Increment count
            await db.update(videos)
                .set({ likes: sql`${videos.likes} + 1` })
                .where(eq(videos.id, videoId));

            return NextResponse.json({ liked: true });
        }

    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
