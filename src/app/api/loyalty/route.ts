import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users, userLevels } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    // [Jules - Adding root endpoint for Loyalty feature to provide overview]
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { loyaltyPoints: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const currentPoints = user.loyaltyPoints || 0;

        const allLevels = await db.query.userLevels.findMany({
            orderBy: [desc(userLevels.minPoints)]
        });

        const currentLevel = allLevels.find(l => l.minPoints <= currentPoints);
        const nextLevel = [...allLevels].reverse().find(l => l.minPoints > currentPoints);

        return NextResponse.json({
            service: "Loyalty",
            status: "operational",
            data: {
                points: currentPoints,
                level: currentLevel,
                nextLevel
            }
        });

    } catch (error) {
        console.error("Error fetching loyalty overview:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
