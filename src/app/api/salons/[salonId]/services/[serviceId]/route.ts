import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { services, salons } from "@/db/schema/salons";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

const serviceSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().int().nonnegative().optional(), // in cents
  duration: z.number().int().positive().optional(), // in minutes
  description: z.string().optional(),
  category: z.string().optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

// PATCH /api/salons/[salonId]/services/[serviceId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string; serviceId: string }> }
) {
  try {
    const { salonId, serviceId } = await params;
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

    // Check if service exists and belongs to salon
    const service = await db.select().from(services).where(and(eq(services.id, serviceId), eq(services.salonId, salonId))).limit(1);
    if (service.length === 0) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const updatedService = await db
      .update(services)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(services.id, serviceId))
      .returning();

    return NextResponse.json(updatedService[0]);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/salons/[salonId]/services/[serviceId]
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ salonId: string; serviceId: string }> }
  ) {
    try {
      const { salonId, serviceId } = await params;
      const session = await auth.api.getSession({
          headers: await headers()
      });

      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Verify ownership
      const salon = await db
        .select()
        .from(salons)
        .where(and(eq(salons.id, salonId), eq(salons.ownerId, session.user.id)))
        .limit(1);

      if (salon.length === 0) {
        return NextResponse.json({ error: "Forbidden: You do not own this salon" }, { status: 403 });
      }

      // Check existence
      const service = await db.select().from(services).where(and(eq(services.id, serviceId), eq(services.salonId, salonId))).limit(1);
      if (service.length === 0) {
          return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }

      await db.delete(services).where(eq(services.id, serviceId));

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting service:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
