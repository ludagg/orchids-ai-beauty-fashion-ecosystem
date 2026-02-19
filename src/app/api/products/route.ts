import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { salons } from "@/db/schema/salons";
import { eq, and, ilike, desc, asc, gt, gte, lte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { nanoid } from "nanoid";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0), // In cents
  stock: z.number().min(0),
  category: z.string().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional(), // Array of URLs
  salonId: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const salonId = searchParams.get("salonId");
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");
    const includeInactive = searchParams.get("includeInactive") === "true";

    // New filters
    const minPriceRaw = searchParams.get("minPrice");
    const maxPriceRaw = searchParams.get("maxPrice");
    const minRatingRaw = searchParams.get("minRating");
    const sortBy = searchParams.get("sortBy") || "newest";

    const conditions = [];

    // Active Status Logic
    if (!includeInactive) {
        conditions.push(eq(products.isActive, true));
    } else {
        // Authenticate to allow viewing inactive products
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
             return NextResponse.json({ error: "Unauthorized to view inactive products" }, { status: 401 });
        }

        // If filtering by salon, verify ownership
        if (salonId) {
             const salon = await db.query.salons.findFirst({
                 where: and(eq(salons.id, salonId), eq(salons.ownerId, session.user.id))
             });
             if (!salon) {
                 return NextResponse.json({ error: "Forbidden: You do not own this salon" }, { status: 403 });
             }
        }
    }

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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, description, price, stock, category, brand, images, salonId } = validation.data;

    // Verify ownership
    const salon = await db.query.salons.findFirst({
        where: and(eq(salons.id, salonId), eq(salons.ownerId, session.user.id)),
    });

    if (!salon) {
        return NextResponse.json({ error: "Forbidden: You do not own this salon" }, { status: 403 });
    }

    const newProduct = await db
      .insert(products)
      .values({
        id: nanoid(),
        salonId,
        name,
        description,
        price,
        stock,
        category,
        brand,
        images: images || [],
        isActive: true,
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
