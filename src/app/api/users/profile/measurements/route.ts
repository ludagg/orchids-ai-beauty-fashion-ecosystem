import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const measurementsSchema = z.object({
  height: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  bodyType: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = measurementsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { height, weight, bodyType } = result.data;

    await db
      .update(users)
      .set({
        height: height ?? null,
        weight: weight ?? null,
        bodyType: bodyType ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "Measurements updated successfully" });
  } catch (error) {
    console.error("Error updating user measurements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
