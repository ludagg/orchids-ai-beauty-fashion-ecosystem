import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { height, weight, bodyType } = body;

        // Ensure we are only updating valid measurement fields
        const updateData: any = {};
        if (height !== undefined) updateData.height = String(height);
        if (weight !== undefined) updateData.weight = String(weight);
        if (bodyType !== undefined) updateData.bodyType = String(bodyType);

        if (Object.keys(updateData).length === 0) {
             return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        updateData.updatedAt = new Date();

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true, message: "Measurements updated successfully" });

    } catch (error: any) {
        console.error("Update Measurements Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}