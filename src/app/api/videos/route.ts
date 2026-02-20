import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videos, videoProducts, videoLikes } from "@/db/schema/content";
import { follows } from "@/db/schema/auth";
import { headers } from "next/headers";
import { eq, desc, asc, and, inArray, notInArray, sql } from "drizzle-orm";
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
        const following = searchParams.get('following'); // 'true' | undefined
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const offset = (page - 1) * limit;

        // Base Conditions
        const conditions = [];

        // Handle "Following" filter first as it's a primary mode
        if (following === 'true') {
            if (!session?.user) {
                // If not logged in but requested following feed, return unauthorized or empty
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            // Get list of users the current user follows
            const followedUsers = await db.query.follows.findMany({
                where: eq(follows.followerId, session.user.id),
                columns: {
                    followingId: true
                }
            });

            const followedIds = followedUsers.map(f => f.followingId);

            if (followedIds.length === 0) {
                // User follows no one, return empty list immediately
                return NextResponse.json([]);
            }

            conditions.push(inArray(videos.userId, followedIds));
        }

        // Handle "Live Now" special category or standard category filter
        if (category === 'Live Now') {
            conditions.push(eq(videos.isLive, true));
        } else if (category && category !== 'All') {
            conditions.push(eq(videos.category, category));
        }

        if (userId) {
            conditions.push(eq(videos.userId, userId));
        }

        // Determine if we should apply personalization (User logged in, main feed, default sort)
        // If sorting by 'popular' explicitly, we skip personalization sort.
        // Also skip if 'following' mode is active (usually chronological)
        const isPersonalized = session?.user && !category && !userId && !sortBy && !following;

        let orderByClause: any[] = [desc(videos.createdAt)];

        if (sortBy === 'popular') {
            orderByClause = [desc(videos.views), desc(videos.likes)];
        } else if (isPersonalized) {
             // 1. Get user's liked categories for Smart Feed
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

            // Extract unique categories
            const likedCategories = Array.from(new Set(
                userLikes
                    .map(l => l.video?.category)
                    .filter((c): c is string => typeof c === 'string' && c.length > 0)
            ));

            if (likedCategories.length > 0) {
                // Smart Sort: Prioritize liked categories, then newness
                // We use a CASE WHEN statement in the ORDER BY clause
                // We use inArray helper which returns a SQL chunk valid for embedding

                const matchScore = sql`CASE WHEN ${inArray(videos.category, likedCategories)} THEN 0 ELSE 1 END`;

                orderByClause = [matchScore, desc(videos.createdAt)];
            }
        }

        // Single Query with Pagination
        const videosList = await db.query.videos.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            with: {
                user: true,
                salon: true,
                products: {
                    with: { product: true }
                }
            },
            orderBy: orderByClause,
            limit: limit,
            offset: offset
        });

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
