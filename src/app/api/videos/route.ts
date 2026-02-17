import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videos, videoProducts, videoLikes } from "@/db/schema/content";
import { headers } from "next/headers";
import { eq, desc, and, inArray, notInArray } from "drizzle-orm";
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

        let videosList = [];
        let orderByClause = [desc(videos.createdAt)];
        if (sortBy === 'popular') {
            orderByClause = [desc(videos.views), desc(videos.likes)];
        }

        // Standard Filter Logic
        const conditions = [];
        if (category && category !== 'All') {
            conditions.push(eq(videos.category, category));
        }
        if (userId) {
            conditions.push(eq(videos.userId, userId));
        }

        // Check if we should apply personalization (User logged in, main feed, default sort)
        const isPersonalized = session?.user && !category && !userId && !sortBy;

        if (isPersonalized) {
            // 1. Get user's liked categories
            const userLikes = await db.query.videoLikes.findMany({
                where: eq(videoLikes.userId, session.user.id),
                with: {
                    video: {
                        columns: { category: true }
                    }
                },
                limit: 50,
                orderBy: desc(videoLikes.createdAt)
            });

            // Extract unique categories, filtering out null/undefined
            const likedCategories = Array.from(new Set(
                userLikes
                    .map(l => l.video?.category)
                    .filter((c): c is string => typeof c === 'string' && c.length > 0)
            ));

            if (likedCategories.length > 0) {
                // 2. Fetch Recommended Videos (limit 10)
                const recommended = await db.query.videos.findMany({
                    where: inArray(videos.category, likedCategories),
                    with: {
                        user: true,
                        salon: true,
                        products: {
                            with: { product: true }
                        }
                    },
                    limit: 10,
                    orderBy: desc(videos.createdAt)
                });

                const recommendedIds = recommended.map(v => v.id);

                // 3. Fetch Other Videos (filling the rest of the limit)
                const remainingLimit = Math.max(0, limit - recommended.length);
                let others: typeof recommended = [];

                if (remainingLimit > 0) {
                     const otherConditions = recommendedIds.length > 0
                        ? and(notInArray(videos.id, recommendedIds))
                        : undefined;

                    others = await db.query.videos.findMany({
                        where: otherConditions,
                        with: {
                            user: true,
                            salon: true,
                            products: {
                                with: { product: true }
                            }
                        },
                        limit: remainingLimit,
                        orderBy: desc(videos.createdAt)
                    });
                }

                videosList = [...recommended, ...others];
            } else {
                 // No liked categories found, fall back to standard fetch
                 videosList = await db.query.videos.findMany({
                    where: conditions.length > 0 ? and(...conditions) : undefined,
                    with: {
                        user: true,
                        salon: true,
                        products: { with: { product: true } }
                    },
                    orderBy: orderByClause,
                    limit: limit
                });
            }
        } else {
            // Standard fetch
            videosList = await db.query.videos.findMany({
                where: conditions.length > 0 ? and(...conditions) : undefined,
                with: {
                    user: true,
                    salon: true,
                    products: { with: { product: true } }
                },
                orderBy: orderByClause,
                limit: limit
            });
        }

        // Identify liked videos
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

        // Flatten products & add isLiked
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
