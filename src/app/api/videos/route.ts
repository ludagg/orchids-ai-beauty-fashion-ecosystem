import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videos, videoProducts, videoLikes } from "@/db/schema/content";
import { headers } from "next/headers";
import { eq, desc, and, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const userId = searchParams.get('userId');
        const sortBy = searchParams.get('sortBy'); // 'newest' | 'popular'
        const limit = parseInt(searchParams.get('limit') || '20');

        const conditions = [];
        if (category && category !== 'All') {
            conditions.push(eq(videos.category, category));
        }
        if (userId) {
            conditions.push(eq(videos.userId, userId));
        }

        let orderByClause = [desc(videos.createdAt)];
        if (sortBy === 'popular') {
            orderByClause = [desc(videos.views), desc(videos.likes)];
        }

        const videosList = await db.query.videos.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            with: {
                user: true,
                salon: true,
                products: {
                    with: {
                        product: true
                    }
                }
            },
            orderBy: orderByClause,
            limit: limit
        });

        let likedVideoIds = new Set();
        if (session?.user && videosList.length > 0) {
            const likes = await db.query.videoLikes.findMany({
                where: and(
                    eq(videoLikes.userId, session.user.id),
                    inArray(videoLikes.videoId, videosList.map(v => v.id))
                )
            });
            likes.forEach(l => likedVideoIds.add(l.videoId));
        }

        // Flatten products
        const formatted = videosList.map(v => ({
            ...v,
            products: v.products.map((vp: any) => vp.product),
            isLiked: likedVideoIds.has(v.id)
        }));

        return NextResponse.json(formatted);

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
        const { title, videoUrl, thumbnailUrl, category, description, salonId, isLive, status, productIds } = body;

        if (!title || !videoUrl) {
            return NextResponse.json({ error: "Title and Video URL are required" }, { status: 400 });
        }

        const id = nanoid();

        await db.transaction(async (tx) => {
            await tx.insert(videos).values({
                id,
                userId: session.user.id,
                salonId: salonId || null,
                title,
                description,
                videoUrl,
                thumbnailUrl: thumbnailUrl || videoUrl,
                category,
                status: status || 'published',
                views: 0,
                likes: 0,
                isLive: isLive || false,
            });

            if (productIds && Array.isArray(productIds) && productIds.length > 0) {
                for (const productId of productIds) {
                    await tx.insert(videoProducts).values({
                        id: nanoid(),
                        videoId: id,
                        productId
                    });
                }
            }
        });

        return NextResponse.json({ success: true, id }, { status: 201 });

    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
