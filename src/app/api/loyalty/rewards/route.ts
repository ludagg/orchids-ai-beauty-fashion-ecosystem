import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { rewards, salons } from "@/db/schema";
import { eq, and, isNull, desc, gt } from "drizzle-orm";
import { LoyaltyEngine } from "@/lib/loyalty";
import { z } from "zod";

const redeemSchema = z.object({
    rewardId: z.string()
});

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const salonId = searchParams.get("salonId");

        let whereCondition = and(
            eq(rewards.isActive, true),
            // Filter out rewards with 0 quantity if needed, but let's show them as out of stock
            // or just active ones.
        );

        if (salonId) {
            // Specific salon rewards
            whereCondition = and(whereCondition, eq(rewards.salonId, salonId));
        } else {
            // Platform rewards (salonId is null) OR all?
            // Usually "Rewards Shop" shows all available.
            // But if there are thousands of salons, showing all is messy.
            // Maybe show platform rewards + rewards from salons user follows/booked?
            // For simplicity, let's show platform rewards (salonId is null) by default if no filter provided
            // OR show all if that's the intent.
            // Let's show Platform Rewards + All Salon Rewards mixed for now, limit to 50.
            // Or maybe just Platform rewards?
            // "NULL = récompense plateforme"
            // The prompt says "Explore boutique récompenses: -20% Lumière Spa (500 pts)".
            // This implies salon rewards are visible.
            // I'll return all active rewards for now.
        }

        const availableRewards = await db.query.rewards.findMany({
            where: whereCondition,
            with: {
                salon: {
                    columns: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: [desc(rewards.createdAt)],
            limit: 100
        });

        return NextResponse.json(availableRewards);

    } catch (error) {
        console.error("Error fetching rewards:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = redeemSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
        }

        const { rewardId } = result.data;

        try {
            const redemption = await LoyaltyEngine.redeemReward(session.user.id, rewardId);
            return NextResponse.json({ success: true, ...redemption });
        } catch (err: any) {
            return NextResponse.json({ error: err.message || "Failed to redeem" }, { status: 400 });
        }

    } catch (error) {
        console.error("Error redeeming reward:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
