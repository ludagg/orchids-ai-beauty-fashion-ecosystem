import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema/reviews";
import { bookings } from "@/db/schema/bookings";
import { salons } from "@/db/schema/salons";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { headers } from "next/headers";
import { eq, and, desc, asc, isNotNull, sql, count, avg } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { LoyaltyEngine } from "@/lib/loyalty";

const createReviewSchema = z.object({
  salonId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
  bookingId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get("salonId");
    const verified = searchParams.get("verified");
    const hasPhotos = searchParams.get("hasPhotos");
    const sort = searchParams.get("sort") || "newest";

    let conditions = [];

    if (salonId) {
      conditions.push(eq(reviews.salonId, salonId));
    }
    if (verified === "true") {
      conditions.push(eq(reviews.isVerified, true));
    }
    if (hasPhotos === "true") {
       // Check if images array is not empty
       conditions.push(sql`array_length(${reviews.images}, 1) > 0`);
    }

    let orderBy = desc(reviews.createdAt);
    if (sort === "highest") {
      orderBy = desc(reviews.rating);
    } else if (sort === "lowest") {
      orderBy = asc(reviews.rating);
    }

    const data = await db.query.reviews.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          }
        },
        salon: {
            columns: {
                id: true,
                name: true,
                ownerId: true
            }
        }
      },
      orderBy: [orderBy],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching reviews:", error);
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
    const result = createReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
    }

    const { salonId, rating, comment, images, bookingId } = result.data;

    let isVerified = false;

    if (bookingId) {
        const booking = await db.query.bookings.findFirst({
            where: and(
                eq(bookings.id, bookingId),
                eq(bookings.userId, session.user.id),
                eq(bookings.salonId, salonId),
                eq(bookings.status, 'completed')
            )
        });

        if (booking) {
            isVerified = true;
        } else {
             return NextResponse.json({ error: "Invalid booking ID or booking not completed" }, { status: 400 });
        }
    }

    const reviewId = nanoid();
    const newReview = await db.insert(reviews).values({
      id: reviewId,
      salonId,
      userId: session.user.id,
      rating,
      comment,
      images,
      bookingId: isVerified ? bookingId : null,
      isVerified,
      status: 'approved',
    }).returning();

    // Update salon stats
    const stats = await db.select({
        count: count(reviews.id),
        avg: avg(reviews.rating)
    })
    .from(reviews)
    .where(eq(reviews.salonId, salonId));

    if (stats[0]) {
        await db.update(salons)
            .set({
                totalReviews: stats[0].count,
                averageRating: stats[0].avg?.toString() || '0'
            })
            .where(eq(salons.id, salonId));
    }

    // Send notification to salon owner
    const salon = await db.query.salons.findFirst({
        where: eq(salons.id, salonId),
        columns: { ownerId: true, name: true }
    });

    if (salon && salon.ownerId) {
        await createNotification({
            userId: salon.ownerId,
            type: "review",
            title: "New Review Received",
            message: `You received a ${rating}-star review for ${salon.name}.`,
            link: `/business/reviews`,
            metadata: { reviewId: reviewId, rating }
        });
    }

    // Loyalty Logic
    try {
        let points = 10; // Base points
        if (images && images.length > 0) points += 20; // Photo bonus
        if (isVerified) points += 20; // Verified bonus

        await LoyaltyEngine.addPoints(
            session.user.id,
            points,
            'earned_review',
            `Review for ${salon?.name || 'Salon'}`,
            reviewId
        );

        // Check badges
        const reviewCountResult = await db.select({ value: count() })
            .from(reviews)
            .where(eq(reviews.userId, session.user.id));
        const reviewCount = reviewCountResult[0]?.value || 0;

        const photoReviewCountResult = await db.select({ value: count() })
            .from(reviews)
            .where(and(
                eq(reviews.userId, session.user.id),
                sql`array_length(${reviews.images}, 1) > 0`
            ));
        const photoReviewCount = photoReviewCountResult[0]?.value || 0;

        await LoyaltyEngine.checkBadges(session.user.id, 'review_created', {
            reviewCount,
            photoReviewCount,
            hasPhotos: images && images.length > 0
        });
    } catch (err) {
        console.error("Loyalty error in reviews:", err);
    }

    return NextResponse.json(newReview[0], { status: 201 });

  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
