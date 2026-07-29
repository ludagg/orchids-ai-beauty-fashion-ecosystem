import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { height, weight, bodyType } = body;

    // Validate inputs
    const heightStr = height ? String(height).trim() : null;
    const weightStr = weight ? String(weight).trim() : null;
    const bodyTypeStr = bodyType ? String(bodyType).trim() : null;

    if (!heightStr && !weightStr && !bodyTypeStr) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updateData: any = {};
    if (heightStr !== null) updateData.height = heightStr;
    if (weightStr !== null) updateData.weight = weightStr;
    if (bodyTypeStr !== null) updateData.bodyType = bodyTypeStr;

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "Measurements updated successfully" });
  } catch (error) {
    console.error("Update measurements error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
