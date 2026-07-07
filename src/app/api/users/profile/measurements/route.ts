import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
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

        if (!height || !weight || !bodyType) {
            return NextResponse.json({ error: "Missing measurements data" }, { status: 400 });
        }

        await db.update(users)
            .set({
                height,
                weight,
                bodyType
            })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true, message: "Measurements updated successfully" });
    } catch (error) {
        console.error("Measurements update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
