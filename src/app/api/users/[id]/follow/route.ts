import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { follows } from "@/db/schema";
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

        const currentUserId = session.user.id;

        if (currentUserId === targetUserId) {
            return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
        }

        const body = await req.json();
        const { action } = body; // 'follow' | 'unfollow'

        if (action === 'follow') {
            // Check if already following
            const existingFollow = await db.query.follows.findFirst({
                where: and(
                    eq(follows.followerId, currentUserId),
                    eq(follows.followingId, targetUserId)
                )
            });

            if (!existingFollow) {
                await db.insert(follows).values({
                    id: nanoid(),
                    followerId: currentUserId,
                    followingId: targetUserId
                });
            }
            return NextResponse.json({ success: true, isFollowing: true });

        } else if (action === 'unfollow') {
            await db.delete(follows).where(
                and(
                    eq(follows.followerId, currentUserId),
                    eq(follows.followingId, targetUserId)
                )
            );
            return NextResponse.json({ success: true, isFollowing: false });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Error toggling follow:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
