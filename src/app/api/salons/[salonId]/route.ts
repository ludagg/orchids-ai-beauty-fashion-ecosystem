import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    const salon = await db.query.salons.findFirst({
      where: eq(salons.id, salonId),
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.order)],
        },
        openingHours: {
          orderBy: (hours, { asc }) => [asc(hours.dayOfWeek)],
        },
      },
    });

    if (!salon) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    return NextResponse.json(salon);
  } catch (error) {
    console.error("Error fetching salon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
