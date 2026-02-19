import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shops } from "@/db/schema/shops";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const shop = await db.query.shops.findFirst({
      where: eq(shops.id, id),
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
