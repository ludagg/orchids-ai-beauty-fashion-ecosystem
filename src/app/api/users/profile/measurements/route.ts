import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { height, weight, bodyType } = await req.json();

    if (!height && !weight && !bodyType) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updateData: any = {};
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (bodyType !== undefined) updateData.bodyType = bodyType;
    updateData.updatedAt = new Date();

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true, message: "Measurements updated successfully" });
  } catch (error: any) {
    console.error("Update Measurements API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
