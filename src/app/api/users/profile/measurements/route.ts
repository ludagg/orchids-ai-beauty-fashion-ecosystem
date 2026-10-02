import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        height: true,
        weight: true,
        bodyType: true,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching measurements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { height, weight, bodyType } = body;

    const updatedUser = await db
      .update(users)
      .set({
        ...(height !== undefined && { height: height?.toString() || null }),
        ...(weight !== undefined && { weight: weight?.toString() || null }),
        ...(bodyType !== undefined && { bodyType }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating measurements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
