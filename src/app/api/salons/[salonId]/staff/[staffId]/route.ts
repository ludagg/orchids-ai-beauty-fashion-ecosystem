import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff, staffServices, salons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Update Staff
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string; staffId: string }> }
) {
  try {
    const { salonId, staffId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const salon = await db.query.salons.findFirst({
        where: eq(salons.id, salonId),
    });

    if (!salon || salon.ownerId !== session.user.id) {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, role, image, bio, isActive, serviceIds } = body;

    const [updatedStaff] = await db
      .update(staff)
      .set({
        name,
        role,
        image,
        bio,
        isActive,
      })
      .where(and(eq(staff.id, staffId), eq(staff.salonId, salonId)))
      .returning();

    if (!updatedStaff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    if (serviceIds && Array.isArray(serviceIds)) {
      // Clear existing services
      await db
        .delete(staffServices)
        .where(eq(staffServices.staffId, staffId));

      // Insert new services
      if (serviceIds.length > 0) {
        await db.insert(staffServices).values(
          serviceIds.map((serviceId: string) => ({
            staffId,
            serviceId,
          }))
        );
      }
    }

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Delete Staff
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string; staffId: string }> }
) {
  try {
    const { salonId, staffId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const salon = await db.query.salons.findFirst({
        where: eq(salons.id, salonId),
    });

    if (!salon || salon.ownerId !== session.user.id) {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [deletedStaff] = await db
      .delete(staff)
      .where(and(eq(staff.id, staffId), eq(staff.salonId, salonId)))
      .returning();

    if (!deletedStaff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(deletedStaff);
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
