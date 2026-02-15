import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { salonImages, salons } from "@/db/schema/salons";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
    const { url, caption } = body;

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const id = nanoid();

    const newImage = await db.insert(salonImages).values({
        id,
        salonId,
        url,
        caption,
        order: 0,
    }).returning();

    return NextResponse.json(newImage[0]);
  } catch (error) {
    console.error("Error adding image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
