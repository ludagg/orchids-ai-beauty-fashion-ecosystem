import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, userLevels } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        // Fetch top 100 users
        const topUsers = await db.query.users.findMany({
            where: eq(users.isSuspended, false), // Only active users
            columns: {
                id: true,
                name: true,
                image: true,
                loyaltyPoints: true
            },
            orderBy: [desc(users.loyaltyPoints)],
            limit: 100
        });

        // Fetch levels for calculation
        const levels = await db.select().from(userLevels).orderBy(desc(userLevels.minPoints));

        // Map users to include level
        const leaderboard = topUsers.map(user => {
            const level = levels.find(l => l.minPoints <= (user.loyaltyPoints || 0));
            return {
                ...user,
                level: level ? { name: level.name, badgeImage: level.badgeImage } : null
            };
        });

        return NextResponse.json(leaderboard);

    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
