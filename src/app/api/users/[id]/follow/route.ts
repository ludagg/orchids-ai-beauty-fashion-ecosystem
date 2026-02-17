import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { follows } from "@/db/schema/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: targetUserId } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const followerId = session.user.id;

        if (followerId === targetUserId) {
             return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
        }

        const existingFollow = await db.query.follows.findFirst({
            where: and(eq(follows.followerId, followerId), eq(follows.followingId, targetUserId))
        });

        if (existingFollow) {
            await db.delete(follows).where(eq(follows.id, existingFollow.id));
            return NextResponse.json({ following: false });
        } else {
            await db.insert(follows).values({
                id: nanoid(),
                followerId,
                followingId: targetUserId
            });
            return NextResponse.json({ following: true });
        }

    } catch (error) {
        console.error("Error toggling follow:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
