import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { badges, userBadges } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allBadges = await db.select().from(badges);
        const unlockedBadges = await db.select().from(userBadges).where(eq(userBadges.userId, session.user.id));

        const badgesWithStatus = allBadges.map(badge => {
            const unlocked = unlockedBadges.find(ub => ub.badgeId === badge.id);
            return {
                ...badge,
                isUnlocked: !!unlocked,
                unlockedAt: unlocked?.unlockedAt || null
            };
        });

        return NextResponse.json(badgesWithStatus);

    } catch (error) {
        console.error("Error fetching badges:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
