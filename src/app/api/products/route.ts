import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq, and, ilike, desc, asc, gt, gte, lte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const shopId = searchParams.get("shopId");
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");

    const minPriceRaw = searchParams.get("minPrice");
    const maxPriceRaw = searchParams.get("maxPrice");
    const minRatingRaw = searchParams.get("minRating");
    const sortBy = searchParams.get("sortBy") || "newest";

    const conditions = [eq(products.isActive, true)];

    if (category && category !== "All") {
      conditions.push(eq(products.category, category));
    }

    if (shopId) {
      conditions.push(eq(products.shopId, shopId));
    }

    if (search) {
        conditions.push(ilike(products.name, `%${search}%`));
    }

    if (featured) {
        conditions.push(gt(products.rating, 4.0));
    }

    if (minPriceRaw) {
        const minPrice = parseInt(minPriceRaw);
        if (!isNaN(minPrice)) {
            conditions.push(gte(products.price, minPrice));
        }
    }

    if (maxPriceRaw) {
        const maxPrice = parseInt(maxPriceRaw);
        if (!isNaN(maxPrice)) {
             conditions.push(lte(products.price, maxPrice));
        }
    }

    if (minRatingRaw) {
        const minRating = parseFloat(minRatingRaw);
        if (!isNaN(minRating)) {
            conditions.push(gte(products.rating, minRating));
        }
    }

    let orderByClause;
    switch (sortBy) {
        case 'price_asc':
            orderByClause = asc(products.price);
            break;
        case 'price_desc':
            orderByClause = desc(products.price);
            break;
        case 'rating':
            orderByClause = desc(products.rating);
            break;
        case 'newest':
        default:
            orderByClause = desc(products.createdAt);
            break;
    }

    const data = await db.query.products.findMany({
      where: and(...conditions),
      limit: limit,
      with: {
        shop: {
            columns: {
                name: true,
                id: true,
                slug: true
            }
        }
      },
      orderBy: [orderByClause],
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
