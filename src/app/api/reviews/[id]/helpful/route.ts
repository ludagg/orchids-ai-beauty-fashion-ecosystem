import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema/reviews";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.update(reviews)
        .set({
            helpfulCount: sql`${reviews.helpfulCount} + 1`
        })
        .where(eq(reviews.id, id));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error voting helpful:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
