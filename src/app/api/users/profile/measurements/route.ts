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

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { height, weight, bodyType } = body;

        // At least one field should be provided to update
        if (height === undefined && weight === undefined && bodyType === undefined) {
             return NextResponse.json({ error: "No fields to update provided" }, { status: 400 });
        }

        const updateData: Partial<typeof users.$inferInsert> = {};
        if (height !== undefined) updateData.height = height;
        if (weight !== undefined) updateData.weight = weight;
        if (bodyType !== undefined) updateData.bodyType = bodyType;

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true, message: "Measurements updated successfully" });
    } catch (error) {
        console.error("Error updating measurements:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
