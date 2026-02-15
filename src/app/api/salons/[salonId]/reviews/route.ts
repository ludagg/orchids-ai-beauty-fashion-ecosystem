import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema/reviews";
import { auth } from "@/lib/auth"; // Import auth for session check
import { headers } from "next/headers";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    const salonReviews = await db.query.reviews.findMany({
      where: eq(reviews.salonId, salonId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: [desc(reviews.createdAt)],
    });

    return NextResponse.json(salonReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    // 1. Authenticate User
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate Input
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { rating, comment } = result.data;

    // Check if user already reviewed this salon? (Optional, skipping for simplicity but good practice)
    const existingReview = await db.query.reviews.findFirst({
        where: and(
            eq(reviews.salonId, salonId),
            eq(reviews.userId, session.user.id)
        )
    });

    if (existingReview) {
        return NextResponse.json({ error: "You have already reviewed this salon" }, { status: 400 });
    }

    // 3. Create Review
    const reviewId = nanoid();
    const newReview = await db.insert(reviews).values({
      id: reviewId,
      salonId: salonId,
      userId: session.user.id,
      rating: rating,
      comment: comment,
    }).returning();

    return NextResponse.json(newReview[0], { status: 201 });

  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
