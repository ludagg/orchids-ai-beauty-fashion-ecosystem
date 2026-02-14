import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth"; // We'll use getSession
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

const salonSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(3),
  type: z.enum(["SALON", "BOUTIQUE", "BOTH"]),
  image: z.string().optional(),
});

export async function GET() {
  try {
    const allSalons = await db.select().from(salons);
    return NextResponse.json(allSalons);
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
        image: image,
        status: "pending",
        // isVerified defaults to false
        // createdAt and updatedAt default to now()
      })
      .returning();

    return NextResponse.json(newSalon[0], { status: 201 });
  } catch (error) {
    console.error("Error creating salon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
