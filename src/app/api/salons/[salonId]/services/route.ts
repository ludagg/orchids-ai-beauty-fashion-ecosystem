import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { services, salons } from "@/db/schema/salons";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

const serviceSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative(), // in cents
  duration: z.number().int().positive(), // in minutes
  description: z.string().optional(),
  category: z.string().optional(),
  image: z.string().url().optional(),
});

// GET /api/salons/[salonId]/services
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    if (!salonId) {
       return NextResponse.json({ error: "Salon ID is required" }, { status: 400 });
    }

    const salonServices = await db
      .select()
      .from(services)
      .where(
        and(
          eq(services.salonId, salonId),
          eq(services.isActive, true)
        )
      );

    return NextResponse.json(salonServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/salons/[salonId]/services
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership of the salon
    const salon = await db
      .select()
      .from(salons)
      .where(and(eq(salons.id, salonId), eq(salons.ownerId, session.user.id)))
      .limit(1);

    if (salon.length === 0) {
      return NextResponse.json({ error: "Forbidden: You do not own this salon" }, { status: 403 });
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, price, duration, description, category, image } = result.data;

    const newService = await db
      .insert(services)
      .values({
        id: nanoid(),
        salonId: salonId,
        name,
        price, // cents
        duration, // minutes
        description: description || null,
        category: category || null,
        image: image || null,
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
