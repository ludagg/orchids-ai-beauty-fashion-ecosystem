import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                height: true,
                weight: true,
                bodyType: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error("GET measurements error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { height, weight, bodyType } = body;

        // Basic validation and sanitization
        const updateData: { height?: string; weight?: string; bodyType?: string } = {};

        if (height !== undefined) {
            updateData.height = String(height).replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
        }
        if (weight !== undefined) {
            updateData.weight = String(weight).replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
        }
        if (bodyType !== undefined) {
             updateData.bodyType = String(bodyType).replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
        }

        if (Object.keys(updateData).length === 0) {
             return NextResponse.json({ error: "No valid data to update" }, { status: 400 });
        }

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ message: "Measurements updated successfully" });

    } catch (error) {
        console.error("PATCH measurements error:", error);
         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
