import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { shops } from "@/db/schema/shops";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { and, or, ilike, desc, sql, getTableColumns } from "drizzle-orm";

const shopSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(3),
  image: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search") || searchParams.get("query");
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = parseFloat(searchParams.get("radius") || "50"); // km
    const limit = parseInt(searchParams.get("limit") || "50");

    const conditions = [];

    // Filter by Location (Haversine)
    let distanceField = sql<number>`0`;
    let locationProvided = false;

    if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        if (!isNaN(userLat) && !isNaN(userLng)) {
            locationProvided = true;
            distanceField = sql<number>`(
                6371 * acos(
                    cos(radians(${userLat})) * cos(radians(${shops.latitude})) * cos(radians(${shops.longitude}) - radians(${userLng})) +
                    sin(radians(${userLat})) * sin(radians(${shops.latitude}))
                )
            )`;

            conditions.push(sql`${distanceField} <= ${radius}`);
        }
    }

    // Filter by name or description
    if (query) {
      conditions.push(
        or(
          ilike(shops.name, `%${query}%`),
          ilike(shops.description, `%${query}%`)
        )
      );
    }

    // Filter by city
    if (city) {
      conditions.push(ilike(shops.city, `%${city}%`));
    }

    let queryBuilder = db
      .select({
          ...getTableColumns(shops),
          distance: distanceField
      })
      .from(shops)
      .where(and(...conditions))
      .limit(limit);

    if (locationProvided) {
        queryBuilder = queryBuilder.orderBy(distanceField);
    } else {
        queryBuilder = queryBuilder.orderBy(desc(shops.createdAt));
    }

    const results = await queryBuilder;

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching shops:", error);
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

    const result = shopSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, description, address, city, zipCode, image } = result.data;

    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slug = `${slugBase}-${nanoid(6)}`;
    const shopId = nanoid();

    const newShop = await db
      .insert(shops)
      .values({
        id: shopId,
        ownerId: session.user.id,
        name,
        slug,
        description,
        address,
        city,
        zipCode,
        image,
        status: "pending",
      })
      .returning();

    return NextResponse.json(newShop[0], { status: 201 });
  } catch (error) {
    console.error("Error creating shop:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
