import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { openingHours, salons } from "@/db/schema/salons";
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

    const hours = await db.query.openingHours.findMany({
      where: eq(openingHours.salonId, salonId),
      orderBy: (hours, { asc }) => [asc(hours.dayOfWeek)],
    });

    return NextResponse.json(hours);
  } catch (error) {
    console.error("Error fetching hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    if (!Array.isArray(body)) {
         return NextResponse.json({ error: "Invalid body, expected array" }, { status: 400 });
    }

    await db.transaction(async (tx) => {
        await tx.delete(openingHours).where(eq(openingHours.salonId, salonId));

        if (body.length > 0) {
            const values = body.map((h: any) => ({
                id: nanoid(),
                salonId,
                dayOfWeek: h.dayOfWeek,
                openTime: h.openTime || null,
                closeTime: h.closeTime || null,
                isClosed: h.isClosed ?? false,
            }));
            await tx.insert(openingHours).values(values);
        }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
