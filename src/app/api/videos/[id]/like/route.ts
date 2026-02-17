import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videoLikes, videos } from "@/db/schema/content";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if like exists
        const existingLike = await db.query.videoLikes.findFirst({
            where: and(eq(videoLikes.videoId, id), eq(videoLikes.userId, userId))
        });

        await db.transaction(async (tx) => {
            if (existingLike) {
                // Unlike
                await tx.delete(videoLikes).where(eq(videoLikes.id, existingLike.id));
                await tx.update(videos)
                    .set({ likes: sql`${videos.likes} - 1` })
                    .where(eq(videos.id, id));
            } else {
                // Like
                await tx.insert(videoLikes).values({
                    id: nanoid(),
                    videoId: id,
                    userId
                });
                await tx.update(videos)
                    .set({ likes: sql`${videos.likes} + 1` })
                    .where(eq(videos.id, id));
            }
        });

        const updatedVideo = await db.query.videos.findFirst({
            where: eq(videos.id, id),
            columns: { likes: true }
        });

        return NextResponse.json({
            success: true,
            liked: !existingLike,
            likes: updatedVideo?.likes || 0
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
