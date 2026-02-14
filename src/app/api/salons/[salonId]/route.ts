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

    const salon = await db
      .select()
      .from(salons)
      .where(eq(salons.id, salonId))
      .limit(1);

    if (salon.length === 0) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    return NextResponse.json(salon[0]);
  } catch (error) {
    console.error("Error fetching salon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
