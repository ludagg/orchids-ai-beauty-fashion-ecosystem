import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, salons, follows, videos } from "@/db/schema";
import { eq, and, count, sum } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: targetUserId } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        // 1. Fetch User
        const user = await db.query.users.findFirst({
            where: eq(users.id, targetUserId),
            columns: {
                id: true,
                name: true,
                image: true,
                email: true,
                role: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Fetch Salon (if owner)
        const salon = await db.query.salons.findFirst({
            where: eq(salons.ownerId, targetUserId),
             columns: {
                id: true,
                name: true,
                description: true,
                slug: true
            }
        });

        // 3. Stats
        // Followers
        const followersCount = await db
            .select({ count: count() })
            .from(follows)
            .where(eq(follows.followingId, targetUserId))
            .then(res => res[0]?.count || 0);

        // Following
        const followingCount = await db
            .select({ count: count() })
            .from(follows)
            .where(eq(follows.followerId, targetUserId))
            .then(res => res[0]?.count || 0);

        // Likes (sum of all video likes for this user)
        const likesCount = await db
            .select({ total: sum(videos.likes) })
            .from(videos)
            .where(eq(videos.userId, targetUserId))
            .then(res => Number(res[0]?.total) || 0);

        // 4. Is Following?
        let isFollowing = false;
        if (session?.user) {
            const followCheck = await db.query.follows.findFirst({
                where: and(
                    eq(follows.followerId, session.user.id),
                    eq(follows.followingId, targetUserId)
                )
            });
            isFollowing = !!followCheck;
        }

        return NextResponse.json({
            user: {
                ...user,
                // Add salon description to user object for easy consumption if desired, or keep separate
                bio: salon?.description || "No bio available.",
                handle: salon?.slug ? `@${salon.slug}` : `@${user.name.toLowerCase().replace(/\s+/g, '_')}`
            },
            stats: {
                followers: followersCount,
                following: followingCount,
                likes: likesCount
            },
            isFollowing
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
