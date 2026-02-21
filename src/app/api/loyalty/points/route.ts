import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { pointTransactions, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { LoyaltyEngine } from "@/lib/loyalty";
import { userLevels } from "@/db/schema";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch latest points from DB (session might be stale)
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { loyaltyPoints: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const currentPoints = user.loyaltyPoints || 0;

        // Fetch transactions
        const history = await db.query.pointTransactions.findMany({
            where: eq(pointTransactions.userId, userId),
            orderBy: [desc(pointTransactions.createdAt)],
            limit: 50 // Limit to last 50
        });

        // Get Level Info
        const allLevels = await db.query.userLevels.findMany({
            orderBy: [desc(userLevels.minPoints)]
        });

        // Logic to find current and next level
        // levels are sorted desc (Diamond, Platinum, Gold...)
        const currentLevel = allLevels.find(l => l.minPoints <= currentPoints);
        const nextLevel = [...allLevels].reverse().find(l => l.minPoints > currentPoints);

        return NextResponse.json({
            points: currentPoints,
            level: currentLevel,
            nextLevel,
            history
        });

    } catch (error) {
        console.error("Error fetching loyalty points:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
