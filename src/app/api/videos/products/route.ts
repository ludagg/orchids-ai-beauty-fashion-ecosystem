import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videos, videoProducts } from "@/db/schema/content";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { videoId, productIds } = body;

        if (!videoId || !Array.isArray(productIds)) {
            return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
        }

        // Verify that the user owns the video
        const video = await db.query.videos.findFirst({
            where: eq(videos.id, videoId)
        });

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        if (video.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden: You do not own this video" }, { status: 403 });
        }

        if (productIds.length > 0) {
            const itemsToInsert = productIds.map(productId => ({
                id: nanoid(),
                videoId,
                productId,
            }));

            // Bulk insert using Drizzle ORM
            await db.insert(videoProducts).values(itemsToInsert);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error linking products to video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
