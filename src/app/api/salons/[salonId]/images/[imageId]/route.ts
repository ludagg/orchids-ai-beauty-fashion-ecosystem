import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { salonImages, salons } from "@/db/schema/salons";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string, imageId: string }> }
) {
  try {
    const { salonId, imageId } = await params;
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

    await db.delete(salonImages).where(
        and(
            eq(salonImages.id, imageId),
            eq(salonImages.salonId, salonId)
        )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
