import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services, salons } from "@/db/schema/salons";
import { eq, ilike, and, or, gte, lte, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("q");
    const category = searchParams.get("category");
    const salonId = searchParams.get("salonId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = parseInt(searchParams.get("limit") || "50");

    const conditions = [];

    // Only active services
    conditions.push(eq(services.isActive, true));

    if (query) {
      conditions.push(
        or(
          ilike(services.name, `%${query}%`),
          ilike(services.description, `%${query}%`)
        )
      );
    }

    if (category) {
      conditions.push(ilike(services.category, `%${category}%`));
    }

    if (salonId) {
      conditions.push(eq(services.salonId, salonId));
    }

    if (minPrice) {
      conditions.push(gte(services.price, parseInt(minPrice) * 100)); // Price in cents
    }

    if (maxPrice) {
      conditions.push(lte(services.price, parseInt(maxPrice) * 100));
    }

    const queryBuilder = db
      .select({
        id: services.id,
        name: services.name,
        description: services.description,
        price: services.price,
        duration: services.duration,
        category: services.category,
        image: services.image,
        salonId: services.salonId,
        salonName: salons.name,
        salonCity: salons.city,
      })
      .from(services)
      .leftJoin(salons, eq(services.salonId, salons.id))
      .where(and(...conditions))
      .orderBy(desc(services.createdAt))
      .limit(limit);

    const results = await queryBuilder;

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
