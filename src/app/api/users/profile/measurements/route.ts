import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // `height`, `weight`, `bodyType` are exposed via session.user because we added them in `src/lib/auth.ts`
    return NextResponse.json({
      height: session.user.height || null,
      weight: session.user.weight || null,
      bodyType: session.user.bodyType || null,
    });
  } catch (error) {
    console.error("Error in GET /api/users/profile/measurements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { height, weight, bodyType } = await request.json();

    // Input sanitization
    const sanitize = (str: string | undefined | null) => {
        if (!str) return null;
        return String(str).replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
    };

    const sHeight = sanitize(height);
    const sWeight = sanitize(weight);
    const sBodyType = sanitize(bodyType);

    await db
      .update(users)
      .set({
        height: sHeight,
        weight: sWeight,
        bodyType: sBodyType,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true, height: sHeight, weight: sWeight, bodyType: sBodyType });
  } catch (error) {
    console.error("Error in PATCH /api/users/profile/measurements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
