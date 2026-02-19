import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth"; // We'll use getSession
import { db } from "@/lib/db";
import { salons, services } from "@/db/schema/salons";
import { users } from "@/db/schema/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { and, or, ilike, eq, desc, gte, lte, exists, sql, getTableColumns } from "drizzle-orm";

const salonSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(3),
  type: z.enum(["SALON", "BOUTIQUE", "BOTH"]),
  image: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search") || searchParams.get("query"); // Accept both
    const city = searchParams.get("city");
    const type = searchParams.get("type"); // SALON, BOUTIQUE, BOTH
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
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
            // 6371 is Earth radius in km
            // acos(sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lon2-lon1))*6371
            distanceField = sql<number>`(
                6371 * acos(
                    cos(radians(${userLat})) * cos(radians(${salons.latitude})) * cos(radians(${salons.longitude}) - radians(${userLng})) +
                    sin(radians(${userLat})) * sin(radians(${salons.latitude}))
                )
            )`;

            conditions.push(sql`${distanceField} <= ${radius}`);
        }
    }

    // Filter by name or description (case-insensitive)
    if (query) {
      conditions.push(
        or(
          ilike(salons.name, `%${query}%`),
          ilike(salons.description, `%${query}%`)
        )
      );
    }

    // Filter by city (case-insensitive)
    if (city) {
      conditions.push(ilike(salons.city, `%${city}%`));
    }

    // Filter by type
    if (type) {
        if (type === 'SALON') {
             // Show salons that provide SALON services or both
             conditions.push(or(eq(salons.type, 'SALON'), eq(salons.type, 'BOTH')));
        } else if (type === 'BOUTIQUE') {
             // Show salons that provide BOUTIQUE services or both
             conditions.push(or(eq(salons.type, 'BOUTIQUE'), eq(salons.type, 'BOTH')));
        } else if (type === 'BOTH') {
             conditions.push(eq(salons.type, 'BOTH'));
        }
    }

    // Filter by Price Range (using services)
    if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice) * 100 : 0;
        const max = maxPrice ? parseInt(maxPrice) * 100 : 10000000; // Large number

        conditions.push(
            exists(
                db.select()
                    .from(services)
                    .where(
                        and(
                            eq(services.salonId, salons.id),
                            gte(services.price, min),
                            lte(services.price, max)
                        )
                    )
            )
        );
    }

    let queryBuilder = db
      .select({
          ...getTableColumns(salons),
          distance: distanceField
      })
      .from(salons)
      .where(and(...conditions))
      .limit(limit);

    if (locationProvided) {
        // Order by distance if location provided
        queryBuilder = queryBuilder.orderBy(distanceField);
    } else {
        queryBuilder = queryBuilder.orderBy(desc(salons.createdAt));
    }

    const results = await queryBuilder;

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching salons:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate User
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate Input
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate required fields explicitly first
    if (!body.name || !body.description || !body.address || !body.city || !body.zipCode || !body.type) {
         return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = salonSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, description, address, city, zipCode, type, image } = result.data;

    const finalImage = (image && image.trim() !== "") ? image : "/images/partner-placeholder.png";

    // 3. Generate Slug (basic implementation)
    // In production, you might want to check for collisions or use a library like slugify
    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Add randomness to slug to ensure uniqueness
    const slug = `${slugBase}-${nanoid(6)}`;

    // 4. Create Salon
    // We need to match the fields defined in src/db/schema/salons.ts
    // The id field is text and primary key, so we should generate it.
    // The ownerId comes from the session.

    // Note: nanoid() generates a string ID.
    const salonId = nanoid();

    const newSalon = await db
      .insert(salons)
      .values({
        id: salonId,
        ownerId: session.user.id,
        name: name,
        slug: slug,
        description: description,
        address: address,
        city: city,
        zipCode: zipCode,
        type: type,
        image: finalImage,
        status: "pending",
        // isVerified defaults to false
        // createdAt and updatedAt default to now()
      })
      .returning();

    // Update user role to salon_owner
    await db.update(users)
      .set({ role: 'salon_owner' })
      .where(eq(users.id, session.user.id));

    return NextResponse.json(newSalon[0], { status: 201 });
  } catch (error) {
    console.error("Error creating salon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
