import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { height, weight, bodyType } = body;

        // Basic validation
        if (height && typeof height !== "string") {
            return NextResponse.json({ error: "Invalid height format" }, { status: 400 });
        }
        if (weight && typeof weight !== "string") {
            return NextResponse.json({ error: "Invalid weight format" }, { status: 400 });
        }
        if (bodyType && typeof bodyType !== "string") {
            return NextResponse.json({ error: "Invalid bodyType format" }, { status: 400 });
        }

        const updateData: Partial<typeof users.$inferInsert> = {};
        if (height !== undefined) updateData.height = height;
        if (weight !== undefined) updateData.weight = weight;
        if (bodyType !== undefined) updateData.bodyType = bodyType;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
        }

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ message: "Measurements updated successfully" });
    } catch (error) {
        console.error("Measurements update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
