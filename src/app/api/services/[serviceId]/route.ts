import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { services, salons } from "@/db/schema/salons";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

// DELETE /api/services/[serviceId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // To verify ownership, we need to join services -> salons -> ownerId
    // Or fetch service first to get salonId, then check salon owner.

    // 1. Fetch service to get salonId
    const service = await db
        .select()
        .from(services)
        .where(eq(services.id, serviceId))
        .limit(1);

    if (service.length === 0) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const targetService = service[0];

    // 2. Check if user owns the salon
    const salon = await db
        .select()
        .from(salons)
        .where(and(eq(salons.id, targetService.salonId), eq(salons.ownerId, session.user.id)))
        .limit(1);

    if (salon.length === 0) {
        return NextResponse.json({ error: "Forbidden: You do not own this service" }, { status: 403 });
    }

    // 3. Delete service
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
