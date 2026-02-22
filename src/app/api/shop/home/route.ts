import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { desc, eq, gt, and, sql } from "drizzle-orm";

export async function GET() {
  try {
    const activeCondition = and(eq(products.status, 'ACTIVE'), eq(products.visibility, 'PUBLIC'));

    const [heroProducts, recommendedProducts, trendingProducts, newArrivals, bestSellers] = await Promise.all([
      // Hero: Featured products
      db.query.products.findMany({
        where: and(activeCondition, eq(products.featured, true)),
        limit: 5,
        orderBy: [desc(products.createdAt)],
        with: { salon: { columns: { name: true, slug: true } } }
      }),
      // Recommended: High rating (Randomized)
      db.query.products.findMany({
        where: and(activeCondition, gt(products.rating, 4.0)),
        limit: 8,
        orderBy: sql`RANDOM()`,
        with: { salon: { columns: { name: true, slug: true } } }
      }),
      // Trending: Recent high rating
      db.query.products.findMany({
        where: activeCondition,
        limit: 8,
        orderBy: [desc(products.rating), desc(products.createdAt)],
        with: { salon: { columns: { name: true, slug: true } } }
      }),
      // New Arrivals
      db.query.products.findMany({
        where: activeCondition,
        limit: 8,
        orderBy: [desc(products.createdAt)],
        with: { salon: { columns: { name: true, slug: true } } }
      }),
      // Best Sellers: High review count
      db.query.products.findMany({
        where: activeCondition,
        limit: 8,
        orderBy: [desc(products.reviewCount)],
        with: { salon: { columns: { name: true, slug: true } } }
      })
    ]);

    const mapProduct = (p: any) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.salePrice ?? p.originalPrice,
        originalPrice: p.originalPrice,
        rating: p.rating || 0,
        reviewCount: p.reviewCount || 0,
        images: [p.mainImageUrl, ...(p.galleryUrls || [])].filter(Boolean),
        totalStock: p.totalStock,
        featured: p.featured,
        createdAt: p.createdAt,
        salon: p.salon
    });

    return NextResponse.json({
      hero: heroProducts.map(mapProduct),
      recommended: recommendedProducts.map(mapProduct),
      trending: trendingProducts.map(mapProduct),
      newArrivals: newArrivals.map(mapProduct),
      bestSellers: bestSellers.map(mapProduct)
    });

  } catch (error) {
    console.error("Error fetching shop home data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
