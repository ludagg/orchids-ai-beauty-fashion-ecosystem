import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { salons, services } from "@/db/schema/salons";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { nanoid } from "nanoid";

const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0), // In cents
  duration: z.number().min(1), // In minutes
  category: z.string().optional(),
  image: z.string().optional(),
  salonId: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get("salonId");
    const includeInactive = searchParams.get("includeInactive") === "true";

    if (!salonId) {
      return NextResponse.json({ error: "Missing salonId" }, { status: 400 });
    }

    const conditions = [eq(services.salonId, salonId)];

    if (!includeInactive) {
        conditions.push(eq(services.isActive, true));
    } else {
        // Authenticate
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
             return NextResponse.json({ error: "Unauthorized to view inactive services" }, { status: 401 });
        }

        // Verify ownership
        const salon = await db.query.salons.findFirst({
            where: and(eq(salons.id, salonId), eq(salons.ownerId, session.user.id))
        });

        if (!salon) {
             return NextResponse.json({ error: "Forbidden: You do not own this salon" }, { status: 403 });
        }
    }

    const result = await db
      .select()
      .from(services)
      .where(and(...conditions))
      .orderBy(services.name);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching services:", error);
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

    const validation = serviceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, description, price, duration, category, image, salonId } = validation.data;

    // Verify ownership
    const salon = await db.query.salons.findFirst({
        where: and(eq(salons.id, salonId), eq(salons.ownerId, session.user.id)),
    });

    if (!salon) {
        return NextResponse.json({ error: "Forbidden: You do not own this salon" }, { status: 403 });
    }

    const newService = await db
      .insert(services)
      .values({
        id: nanoid(),
        salonId,
        name,
        description,
        price,
        duration,
        category,
        image,
        isActive: true,
      })
      .returning();

    return NextResponse.json(newService[0], { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
