import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videos, videoLikes, videoComments } from "@/db/schema/content";
import { follows } from "@/db/schema/auth";
import { eq, and, count } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        // Fetch video and comments count in parallel
        const [video, commentsCountResult] = await Promise.all([
            db.query.videos.findFirst({
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
            }),
            db.select({ count: count() })
              .from(videoComments)
              .where(eq(videoComments.videoId, id))
        ]);

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const commentsCount = commentsCountResult[0]?.count || 0;

        let isLiked = false;
        let isFollowing = false;

        if (session?.user) {
            const [like, follow] = await Promise.all([
                db.query.videoLikes.findFirst({
                    where: and(eq(videoLikes.videoId, id), eq(videoLikes.userId, session.user.id))
                }),
                video.userId ? db.query.follows.findFirst({
                    where: and(eq(follows.followerId, session.user.id), eq(follows.followingId, video.userId))
                }) : Promise.resolve(null)
            ]);

            isLiked = !!like;
            isFollowing = !!follow;
        }

        const formatted = {
            ...video,
            products: video.products.map((vp: any) => vp.product),
            isLiked,
            isFollowing,
            commentsCount
        };

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("Error fetching video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
