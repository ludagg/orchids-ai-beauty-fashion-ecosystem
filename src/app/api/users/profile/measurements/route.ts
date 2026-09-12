import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session || !session.user) {
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

        return NextResponse.json(user || { height: null, weight: null, bodyType: null });
    } catch (error) {
        console.error("Error fetching measurements:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Basic sanitization
        const sanitize = (str: string | undefined | null) => {
            if (typeof str !== 'string') return null;
            return str.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
        };

        const updateData: Partial<typeof users.$inferInsert> = {};

        if (body.height !== undefined) {
             updateData.height = sanitize(body.height);
        }
        if (body.weight !== undefined) {
             updateData.weight = sanitize(body.weight);
        }
        if (body.bodyType !== undefined) {
             updateData.bodyType = sanitize(body.bodyType);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No valid data provided" }, { status: 400 });
        }

        const [updatedUser] = await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id))
            .returning({
                height: users.height,
                weight: users.weight,
                bodyType: users.bodyType
            });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating measurements:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
