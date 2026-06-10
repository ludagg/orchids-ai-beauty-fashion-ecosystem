import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brandDeals, influencerProfiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";

const createDealSchema = z.object({
    influencerId: z.string(),
    salonId: z.string().optional(),
    title: z.string(),
    description: z.string(),
    requirements: z.string().optional(),
    rewardAmount: z.number().optional(),
});

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const influencerProfile = await db.query.influencerProfiles.findFirst({
            where: eq(influencerProfiles.userId, session.user.id)
        });

        if (!influencerProfile && session.user.role !== 'admin' && session.user.role !== 'salon_owner') {
            return NextResponse.json({ error: "Unauthorized, not an influencer" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const influencerId = searchParams.get("influencerId") || influencerProfile?.id;

        if (!influencerId) {
             return NextResponse.json({ error: "Influencer ID missing" }, { status: 400 });
        }

        const deals = await db.query.brandDeals.findMany({
            where: eq(brandDeals.influencerId, influencerId),
            orderBy: [desc(brandDeals.createdAt)]
        });

        return NextResponse.json(deals);
    } catch (error) {
        console.error("Error fetching brand deals:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || (session.user.role !== 'salon_owner' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = createDealSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
        }

        const newDeal = await db.insert(brandDeals).values({
            id: nanoid(),
            ...result.data
        }).returning();

        return NextResponse.json(newDeal[0], { status: 201 });

    } catch (error) {
        console.error("Error creating brand deal:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
