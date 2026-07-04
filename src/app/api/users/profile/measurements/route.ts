import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

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

    if (!height || !weight || !bodyType) {
      return NextResponse.json({ error: "Height, weight, and bodyType are required" }, { status: 400 });
    }

    await db.update(users)
      .set({
        height: height.toString(),
        weight: weight.toString(),
        bodyType: bodyType.toString(),
        updatedAt: new Date()
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating measurements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
