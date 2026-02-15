import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { salons } from "@/db/schema/salons";
import { eq, and, ilike, desc, gt, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const salonId = searchParams.get("salonId");
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");

    const conditions = [eq(products.isActive, true)];

    if (category && category !== "All") {
      conditions.push(eq(products.category, category));
    }

    if (salonId) {
      conditions.push(eq(products.salonId, salonId));
    }

    if (search) {
        conditions.push(ilike(products.name, `%${search}%`));
    }

    if (featured) {
        // Simple featured logic: high rating or new
        conditions.push(gt(products.rating, 4.0));
    }

    const data = await db.query.products.findMany({
      where: and(...conditions),
      limit: limit,
      with: {
        salon: {
            columns: {
                name: true,
                id: true,
                slug: true
            }
        }
      },
      orderBy: [desc(products.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
