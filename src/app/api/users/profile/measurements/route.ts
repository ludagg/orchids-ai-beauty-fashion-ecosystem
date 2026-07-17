import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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

        await db.update(users)
            .set({
                height: height ? String(height) : null,
                weight: weight ? String(weight) : null,
                bodyType: bodyType || null,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Profile measurements update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
