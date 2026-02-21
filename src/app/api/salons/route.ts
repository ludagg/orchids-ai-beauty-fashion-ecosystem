import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { salons, services, salonImages } from "@/db/schema/salons";
import { users } from "@/db/schema/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { and, or, ilike, eq, desc, gte, lte, exists, sql, getTableColumns } from "drizzle-orm";

// Schema for the new partner flow
const partnerSchema = z.object({
  personal: z.object({
    name: z.string().min(2),
    phone: z.string().min(8),
    profilePhoto: z.string().optional(),
  }),
  business: z.object({
    name: z.string().min(2),
    category: z.string(),
    description: z.string().max(500),
    website: z.string().optional(),
    logo: z.string().optional(),
  }),
  address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().min(2),
    zipCode: z.string().min(3),
  }),
  docs: z.object({
    registrationNumber: z.string().min(2),
    idUrl: z.string().url(),
    proofUrl: z.string().url(),
  }),
  gallery: z.array(z.string().url()).min(2).max(10),
});

// Legacy schema for backward compatibility (if needed)
const legacySchema = z.object({
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
    const query = searchParams.get("search") || searchParams.get("query");
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = parseFloat(searchParams.get("radius") || "50");
    const limit = parseInt(searchParams.get("limit") || "50");

    const conditions = [];

    // Filter by status (only active salons are visible)
    conditions.push(eq(salons.status, 'active'));

    let distanceField = sql<number>`0`;
    let locationProvided = false;

    if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        if (!isNaN(userLat) && !isNaN(userLng)) {
            locationProvided = true;
            distanceField = sql<number>`(
                6371 * acos(
                    cos(radians(${userLat})) * cos(radians(${salons.latitude})) * cos(radians(${salons.longitude}) - radians(${userLng})) +
                    sin(radians(${userLat})) * sin(radians(${salons.latitude}))
                )
            )`;
            conditions.push(sql`${distanceField} <= ${radius}`);
        }
    }

    if (query) {
      conditions.push(
        or(
          ilike(salons.name, `%${query}%`),
          ilike(salons.description, `%${query}%`)
        )
      );
    }

    if (city) {
      conditions.push(ilike(salons.city, `%${city}%`));
    }

    if (type) {
        if (type === 'SALON') {
             conditions.push(or(eq(salons.type, 'SALON'), eq(salons.type, 'BOTH')));
        } else if (type === 'BOUTIQUE') {
             conditions.push(or(eq(salons.type, 'BOUTIQUE'), eq(salons.type, 'BOTH')));
        } else if (type === 'BOTH') {
             conditions.push(eq(salons.type, 'BOTH'));
        }
    }

    if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice) * 100 : 0;
        const max = maxPrice ? parseInt(maxPrice) * 100 : 10000000;
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

    // Determine if it's the new flow or legacy
    const isNewFlow = body.personal && body.business;

    if (isNewFlow) {
        const result = partnerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
        }

        const { personal, business, address, docs, gallery } = result.data;

        // 1. Geocoding
        let lat = null;
        let lng = null;
        let formattedAddress = `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.zipCode}`;

        try {
             // Use minimal throttling or cache in prod, but for now direct call
             const query = encodeURIComponent(formattedAddress);
             const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
                 headers: {
                     'User-Agent': 'RareApp/1.0' // Nominatim requires User-Agent
                 }
             });
             const geoData = await geoRes.json();
             if (geoData && geoData.length > 0) {
                 lat = geoData[0].lat;
                 lng = geoData[0].lon;
                 formattedAddress = geoData[0].display_name;
             }
        } catch (err) {
            console.error("Geocoding failed:", err);
            // Proceed without coords, or fail? Prompt says "Store lat/lng...".
            // We'll proceed with null and maybe retry later or admin can fix.
        }

        // 2. Map Category to Type
        let type: "SALON" | "BOUTIQUE" | "BOTH" = "SALON";
        const cat = business.category.toLowerCase();
        if (cat.includes("fashion") || cat.includes("store") || cat.includes("boutique")) {
            type = "BOUTIQUE";
        }
        // "Both" logic if needed, or default SALON for services.

        // 3. Update User
        await db.update(users)
            .set({
                name: personal.name,
                phone: personal.phone,
                image: personal.profilePhoto || session.user.image,
                role: 'salon_owner' // Upgrade role immediately? Or wait for approval?
                // Prompt says: "Create partner account... Partner is redirected to dashboard".
                // If they can access dashboard, they likely need the role or the dashboard checks ownership.
                // Usually ownership is checked by `salons.ownerId`.
                // I'll set role to 'salon_owner' so they can see "My Business" links.
            })
            .where(eq(users.id, session.user.id));

        // 4. Create Salon
        const salonId = nanoid();
        const slugBase = business.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const slug = `${slugBase}-${nanoid(6)}`;

        const newSalon = await db.insert(salons).values({
            id: salonId,
            ownerId: session.user.id,
            name: business.name,
            slug: slug,
            description: business.description,
            address: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            zipCode: address.zipCode,
            formattedAddress: formattedAddress,
            latitude: lat,
            longitude: lng,
            phone: personal.phone, // Using personal phone as business contact for now if not provided separate
            website: business.website,
            category: business.category,
            logo: business.logo,
            image: gallery[0] || business.logo, // Main image
            galleryUrls: gallery,
            registrationNumber: docs.registrationNumber,
            idDocumentUrl: docs.idUrl,
            businessProofUrl: docs.proofUrl,
            type: type,
            status: "pending",
        }).returning();

        // 5. Insert Gallery Images
        if (gallery.length > 0) {
            await db.insert(salonImages).values(
                gallery.map((url, index) => ({
                    id: nanoid(),
                    salonId: salonId,
                    url: url,
                    order: index
                }))
            );
        }

        return NextResponse.json(newSalon[0], { status: 201 });

    } else {
        // Fallback for Legacy Request
        const result = legacySchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

        const { name, description, address, city, zipCode, type, image } = result.data;
        // ... (Keep existing logic if needed, or just redirect to new flow error)
        // I'll implement minimal legacy support just in case
        const salonId = nanoid();
        const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(6)}`;

        const newSalon = await db.insert(salons).values({
            id: salonId,
            ownerId: session.user.id,
            name, slug, description, address, city, zipCode, type,
            image: image || "/images/partner-placeholder.png",
            status: "pending"
        }).returning();

        return NextResponse.json(newSalon[0], { status: 201 });
    }

  } catch (error) {
    console.error("Error creating salon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
