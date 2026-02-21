import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { rewards, salons } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

const createRewardSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  cost: z.number().int().positive(),
  type: z.enum(['discount_fixed', 'discount_percent', 'free_service', 'product']),
  value: z.number().positive().optional(),
  image: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  validUntil: z.string().optional() // Date string
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ salonId: string }> }) {
    try {
        const { salonId } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const salon = await db.query.salons.findFirst({
            where: eq(salons.id, salonId),
            columns: { ownerId: true }
        });

        if (!salon || salon.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const salonRewards = await db.query.rewards.findMany({
            where: eq(rewards.salonId, salonId),
            orderBy: [desc(rewards.createdAt)]
        });

        return NextResponse.json(salonRewards);
    } catch (error) {
        console.error("Error fetching salon rewards:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ salonId: string }> }) {
    try {
        const { salonId } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const salon = await db.query.salons.findFirst({
            where: eq(salons.id, salonId),
            columns: { ownerId: true }
        });

        if (!salon || salon.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const result = createRewardSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
        }

        const { name, description, cost, type, value, image, quantity, validUntil } = result.data;

        const newReward = await db.insert(rewards).values({
            id: nanoid(),
            salonId,
            name,
            description,
            cost,
            type,
            value,
            image,
            quantity: quantity || null,
            isActive: true,
            validUntil: validUntil ? new Date(validUntil) : null
        }).returning();

        return NextResponse.json(newReward[0], { status: 201 });

    } catch (error) {
        console.error("Error creating reward:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
