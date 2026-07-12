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

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { height, weight, bodyType } = body;

        if (height === undefined && weight === undefined && bodyType === undefined) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const updateData: any = {};
        if (height !== undefined) updateData.height = height.toString();
        if (weight !== undefined) updateData.weight = weight.toString();
        if (bodyType !== undefined) updateData.bodyType = bodyType.toString();

        updateData.updatedAt = new Date();

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ message: "Measurements updated successfully" });

    } catch (error) {
        console.error("Update Measurements Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
