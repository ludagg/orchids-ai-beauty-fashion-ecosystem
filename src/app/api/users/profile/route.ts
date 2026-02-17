import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, image } = body;

    // Validate body (basic check)
    if (!name && !image) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updatedUser = await db
      .update(users)
      .set({
        ...(name && { name }),
        ...(image && { image }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
