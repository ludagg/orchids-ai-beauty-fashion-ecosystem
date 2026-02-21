import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema/reviews";
import { salons } from "@/db/schema/salons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, count, avg } from "drizzle-orm";
import { z } from "zod";

const updateReviewSchema = z.object({
  salonReply: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
    }

    const { salonReply, status } = result.data;

    const review = await db.query.reviews.findFirst({
        where: eq(reviews.id, id),
        with: {
            salon: true
        }
    });

    if (!review) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const isSalonOwner = review.salon?.ownerId === session.user.id;
    const isAdmin = session.user.role === 'admin';

    if (salonReply && !isSalonOwner) {
         return NextResponse.json({ error: "Only salon owner can reply" }, { status: 403 });
    }

    if (status && !isAdmin && !isSalonOwner) {
         return NextResponse.json({ error: "Unauthorized to change status" }, { status: 403 });
    }

    const updateData: any = {};
    if (salonReply) {
        updateData.salonReply = salonReply;
        updateData.salonReplyAt = new Date();
    }
    if (status) {
        updateData.status = status;
    }

    const updatedReview = await db.update(reviews)
        .set(updateData)
        .where(eq(reviews.id, id))
        .returning();

    return NextResponse.json(updatedReview[0]);

  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const review = await db.query.reviews.findFirst({
        where: eq(reviews.id, id),
        with: { salon: true }
    });

    if (!review) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const isAuthor = review.userId === session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isOwner = review.salon?.ownerId === session.user.id; // Maybe owner can request deletion?

    if (!isAuthor && !isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.delete(reviews).where(eq(reviews.id, id));

    // Update stats
    const stats = await db.select({
        count: count(reviews.id),
        avg: avg(reviews.rating)
    })
    .from(reviews)
    .where(eq(reviews.salonId, review.salonId!)); // Assuming salonId exists

    if (stats[0]) {
        await db.update(salons)
            .set({
                totalReviews: stats[0].count,
                averageRating: stats[0].avg?.toString() || '0'
            })
            .where(eq(salons.id, review.salonId!));
    }

    return NextResponse.json({ message: "Review deleted" });

  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
