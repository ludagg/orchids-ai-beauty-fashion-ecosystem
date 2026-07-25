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

        await db.update(users)
            .set({
                height: height || null,
                weight: weight || null,
                bodyType: bodyType || null,
            })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Error updating measurements:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
