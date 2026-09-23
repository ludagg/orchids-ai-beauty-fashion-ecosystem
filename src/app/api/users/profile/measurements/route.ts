import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
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

    // Validate body (basic check)
    if (height === undefined && weight === undefined && bodyType === undefined) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updatedUser = await db
      .update(users)
      .set({
        ...(height !== undefined && { height }),
        ...(weight !== undefined && { weight }),
        ...(bodyType !== undefined && { bodyType }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning({
        height: users.height,
        weight: users.weight,
        bodyType: users.bodyType
      });

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating measurements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
