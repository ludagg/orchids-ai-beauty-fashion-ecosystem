import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { height, weight, bodyType } = body;

        // Basic validation - ensure at least one field is being updated
        if (height === undefined && weight === undefined && bodyType === undefined) {
             return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
        }

        const updateData: {
            height?: string;
            weight?: string;
            bodyType?: string;
            updatedAt: Date;
        } = {
            updatedAt: new Date()
        };
        if (height !== undefined) updateData.height = String(height);
        if (weight !== undefined) updateData.weight = String(weight);
        if (bodyType !== undefined) updateData.bodyType = String(bodyType);

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ message: "Measurements updated successfully", data: updateData });

    } catch (error) {
        console.error("Error updating user measurements:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
