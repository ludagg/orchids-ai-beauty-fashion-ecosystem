import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videos } from "@/db/schema/content";
import { headers } from "next/headers";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '20');

        const conditions = [];
        if (category && category !== 'All') {
            conditions.push(eq(videos.category, category));
        }

        const videosList = await db.query.videos.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            with: {
                user: true,
                salon: true,
            },
            orderBy: [desc(videos.createdAt)],
            limit: limit
        });

        return NextResponse.json(videosList);

    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, videoUrl, thumbnailUrl, category, description, salonId, isLive } = body;

        if (!title || !videoUrl) {
            return NextResponse.json({ error: "Title and Video URL are required" }, { status: 400 });
        }

        const id = nanoid();

        await db.insert(videos).values({
            id,
            userId: session.user.id,
            salonId: salonId || null,
            title,
            description,
            videoUrl,
            thumbnailUrl: thumbnailUrl || videoUrl, // Fallback if no thumb
            category,
            views: 0,
            likes: 0,
            isLive: isLive || false,
        });

        return NextResponse.json({ success: true, id }, { status: 201 });

    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
