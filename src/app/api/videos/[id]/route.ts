import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videos, videoLikes } from "@/db/schema/content";
import { follows } from "@/db/schema/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        const video = await db.query.videos.findFirst({
            where: eq(videos.id, id),
            with: {
                user: true,
                salon: true,
                products: {
                    with: {
                        product: true
                    }
                }
            }
        });

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        let isLiked = false;
        let isFollowing = false;

        if (session?.user) {
            const like = await db.query.videoLikes.findFirst({
                where: and(eq(videoLikes.videoId, id), eq(videoLikes.userId, session.user.id))
            });
            isLiked = !!like;

            if (video.userId) {
                const follow = await db.query.follows.findFirst({
                    where: and(eq(follows.followerId, session.user.id), eq(follows.followingId, video.userId))
                });
                isFollowing = !!follow;
            }
        }

        const formatted = {
            ...video,
            products: video.products.map((vp: any) => vp.product),
            isLiked,
            isFollowing
        };

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("Error fetching video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
