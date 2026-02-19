import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const updateSalonSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  zipCode: z.string().min(3).optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  image: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    const salon = await db.query.salons.findFirst({
      where: eq(salons.id, salonId),
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.order)],
        },
        openingHours: {
          orderBy: (hours, { asc }) => [asc(hours.dayOfWeek)],
        },
      },
    });

    if (!salon) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    return NextResponse.json(salon);
  } catch (error) {
    console.error("Error fetching salon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validation = updateSalonSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.format() },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingSalon = await db.query.salons.findFirst({
        where: and(eq(salons.id, salonId), eq(salons.ownerId, session.user.id)),
    });

    if (!existingSalon) {
        return NextResponse.json({ error: "Forbidden: You do not own this salon" }, { status: 403 });
    }

    const updatedSalon = await db
      .update(salons)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(salons.id, salonId))
      .returning();

    return NextResponse.json(updatedSalon[0]);
  } catch (error) {
    console.error("Error updating salon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
