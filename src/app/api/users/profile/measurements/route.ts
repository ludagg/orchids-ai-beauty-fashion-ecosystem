import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
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

        // Ensure we only update measurements if they are provided in body (or explicitly cleared)
        const updateData: Partial<typeof users.$inferInsert> = {};

        if (height !== undefined) updateData.height = height;
        if (weight !== undefined) updateData.weight = weight;
        if (bodyType !== undefined) updateData.bodyType = bodyType;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No measurement data provided" }, { status: 400 });
        }

        const updatedUsers = await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id))
            .returning();

        if (updatedUsers.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Measurements updated successfully",
            user: updatedUsers[0]
        });

    } catch (error) {
        console.error("Profile measurements update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
