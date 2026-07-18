import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

        // Basic validation
        if (height !== undefined && (isNaN(Number(height)) || Number(height) <= 0)) {
            return NextResponse.json({ error: "Invalid height" }, { status: 400 });
        }
        if (weight !== undefined && (isNaN(Number(weight)) || Number(weight) <= 0)) {
            return NextResponse.json({ error: "Invalid weight" }, { status: 400 });
        }

        const updates: any = { updatedAt: new Date() };
        if (height !== undefined) updates.height = height.toString();
        if (weight !== undefined) updates.weight = weight.toString();
        if (bodyType !== undefined) updates.bodyType = bodyType.toString();

        await db.update(users)
            .set(updates)
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Profile measurements update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
