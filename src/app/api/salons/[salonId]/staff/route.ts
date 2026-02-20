import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff, staffServices, salons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    // Fetch staff for the salon, including their services
    const staffMembers = await db.query.staff.findMany({
      where: eq(staff.salonId, salonId),
      with: {
        services: {
          with: {
            service: true
          }
        }
      }
    });

    return NextResponse.json(staffMembers);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify salon ownership
    const salon = await db.query.salons.findFirst({
        where: eq(salons.id, salonId),
    });

    if (!salon) {
        return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    if (salon.ownerId !== session.user.id) {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, role, image, bio, serviceIds } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newStaffId = nanoid();

    const [newStaff] = await db.insert(staff).values({
      id: newStaffId,
      salonId: salonId,
      name,
      role,
      image,
      bio,
      isActive: true,
    }).returning();

    if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
      await db.insert(staffServices).values(
        serviceIds.map((serviceId: string) => ({
          staffId: newStaffId,
          serviceId,
        }))
      );
    }

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
