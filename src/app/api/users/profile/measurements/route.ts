import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            height: user.height,
            weight: user.weight,
            bodyType: user.bodyType
        });
    } catch (error) {
        console.error("GET measurements error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

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

        // Note: we can't type checking without setting any, because Drizzle isn't synced yet.
        const updateData: any = {};
        if (height !== undefined) updateData.height = height;
        if (weight !== undefined) updateData.weight = weight;
        if (bodyType !== undefined) updateData.bodyType = bodyType;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No data to update" }, { status: 400 });
        }

        await db.update(users).set(updateData).where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH measurements error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
