import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema/reviews";
import { eq, desc } from "drizzle-orm";

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
