import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema/reviews";
import { products } from "@/db/schema/commerce";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productReviews = await db.query.reviews.findMany({
            where: eq(reviews.productId, id),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: [desc(reviews.createdAt)]
        });

        return NextResponse.json(productReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { rating, comment } = body;

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
        }

        const reviewId = nanoid();

        // Insert Review
        const newReview = await db.insert(reviews).values({
            id: reviewId,
            productId: id,
            userId: session.user.id,
            rating: rating,
            comment: comment,
            createdAt: new Date()
        }).returning();

        // Update Product Stats (Rating & Count)
        // Recalculate average
        const allReviews = await db.select({ rating: reviews.rating }).from(reviews).where(eq(reviews.productId, id));

        let avgRating = 0;
        if (allReviews.length > 0) {
            avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        }

        await db.update(products)
            .set({
                rating: avgRating,
                reviewCount: allReviews.length
            })
            .where(eq(products.id, id));

        return NextResponse.json(newReview[0], { status: 201 });

    } catch (error) {
        console.error("Error posting review:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
