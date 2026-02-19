import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const salon = await db.query.salons.findFirst({
      where: eq(salons.ownerId, session.user.id),
      with: {
        images: true,
        openingHours: true,
      },
    });

    if (!salon) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(salon);
  } catch (error) {
    console.error("Error fetching my salon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
