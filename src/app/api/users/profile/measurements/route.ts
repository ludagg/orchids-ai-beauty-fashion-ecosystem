import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const measurementsSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  bodyType: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = measurementsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { height, weight, bodyType } = result.data;
    const updateData: Partial<{ height: string; weight: string; bodyType: string; updatedAt: Date }> = { updatedAt: new Date() };

    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (bodyType !== undefined) updateData.bodyType = bodyType;

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    if (updatedUser.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser[0] });

  } catch (error) {
    console.error("Error updating measurements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
