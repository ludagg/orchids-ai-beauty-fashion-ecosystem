import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { salons } from "@/db/schema/salons";
import { eq, and, ilike, desc, asc, gt, gte, lte, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const salonId = searchParams.get("salonId");
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");

    // New filters
    const minPriceRaw = searchParams.get("minPrice");
    const maxPriceRaw = searchParams.get("maxPrice");
    const minRatingRaw = searchParams.get("minRating");
    const brand = searchParams.get("brand");
    const inStock = searchParams.get("inStock") === "true";
    const sortBy = searchParams.get("sortBy") || "newest";

    // 1. Base conditions: Status must be ACTIVE and Visibility PUBLIC
    const conditions = [
        eq(products.status, 'ACTIVE'),
        eq(products.visibility, 'PUBLIC')
    ];

    if (category && category !== "All") {
      conditions.push(eq(products.mainCategory, category));
    }

    if (salonId) {
      conditions.push(eq(products.salonId, salonId));
    }

    if (search) {
        conditions.push(ilike(products.name, `%${search}%`));
    }

    if (brand) {
        conditions.push(ilike(products.brand, brand)); // Case insensitive brand search
    }

    if (featured) {
        // Simple featured logic: high rating (> 4.0) or explicitly marked featured
        conditions.push(or(gt(products.rating, 4.0), eq(products.featured, true)));
    }

    if (inStock) {
        conditions.push(gt(products.totalStock, 0));
    }

    // Price filtering logic (using originalPrice for simplicity in query, though ideally should use effective price)
    // For now, we filter on originalPrice to avoid complex SQL in this query builder usage
    if (minPriceRaw) {
        const minPrice = parseInt(minPriceRaw); // inputs are in cents
        if (!isNaN(minPrice)) {
            conditions.push(gte(products.originalPrice, minPrice));
        }
    }

    if (maxPriceRaw) {
        const maxPrice = parseInt(maxPriceRaw);
        if (!isNaN(maxPrice)) {
             conditions.push(lte(products.originalPrice, maxPrice));
        }
    }

    if (minRatingRaw) {
        const minRating = parseFloat(minRatingRaw);
        if (!isNaN(minRating)) {
            conditions.push(gte(products.rating, minRating));
        }
    }

    let orderByClause;
    const effectivePrice = sql`COALESCE(${products.salePrice}, ${products.originalPrice})`;

    switch (sortBy) {
        case 'price_asc':
            orderByClause = asc(products.originalPrice); // Simplified sort
            break;
        case 'price_desc':
            orderByClause = desc(products.originalPrice);
            break;
        case 'rating':
            orderByClause = desc(products.rating);
            break;
        case 'newest':
        default:
            orderByClause = desc(products.createdAt);
            break;
    }

    const dbProducts = await db.query.products.findMany({
      where: and(...conditions),
      limit: limit,
      offset: offset,
      with: {
        salon: {
            columns: {
                name: true,
                id: true,
                slug: true
            }
        }
      },
      orderBy: [orderByClause],
    });

    // Map to frontend structure
    const mappedProducts = dbProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.salePrice ?? p.originalPrice, // Use sale price if available
        originalPrice: p.originalPrice,
        rating: p.rating || 0,
        reviewCount: p.reviewCount || 0,
        images: [p.mainImageUrl, ...(p.galleryUrls || [])].filter(Boolean),
        category: p.mainCategory,
        salon: p.salon,
        featured: p.featured,
        totalStock: p.totalStock,
        variants: p.variants,
        colors: p.colors,
        sizes: p.sizes,
    }));

    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
