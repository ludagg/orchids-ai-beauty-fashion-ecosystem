import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 50, // Limit to 50 recent notifications
    });

    console.log(`Fetched ${userNotifications.length} notifications for user ${session.user.id}`);
    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark all as read
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
