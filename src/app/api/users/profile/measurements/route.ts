import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { height, weight, bodyType } = body;

        // Basic validation
        if (!height && !weight && !bodyType) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        const updateData: {
            height?: string;
            weight?: string;
            bodyType?: string;
        } = {};

        if (height !== undefined) updateData.height = height;
        if (weight !== undefined) updateData.weight = weight;
        if (bodyType !== undefined) updateData.bodyType = bodyType;

        const updatedUser = await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id))
            .returning();

        return NextResponse.json({
            message: "Measurements updated successfully",
            user: {
                height: updatedUser[0].height,
                weight: updatedUser[0].weight,
                bodyType: updatedUser[0].bodyType,
            }
        });
    } catch (error) {
        console.error("Update Measurements Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
