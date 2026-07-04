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

        await db.update(users)
            .set({
                height: height || undefined,
                weight: weight || undefined,
                bodyType: bodyType || undefined,
                updatedAt: new Date(),
            })
            .where(eq(users.id, session.user.id));

        // Refetch user to return updated data
        const updatedUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                id: true,
                height: true,
                weight: true,
                bodyType: true,
            }
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating measurements:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
