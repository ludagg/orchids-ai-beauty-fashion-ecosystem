import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const measurementSchema = z.object({
    height: z.string().optional(),
    weight: z.string().optional(),
    bodyType: z.string().optional(),
});

export async function PATCH(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = measurementSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const updates: any = {};
        if (parsed.data.height !== undefined) updates.height = parsed.data.height;
        if (parsed.data.weight !== undefined) updates.weight = parsed.data.weight;
        if (parsed.data.bodyType !== undefined) updates.bodyType = parsed.data.bodyType;

        if (Object.keys(updates).length > 0) {
            await db.update(users)
                .set(updates)
                .where(eq(users.id, session.user.id));
        }

        return NextResponse.json({ success: true, message: "Measurements updated successfully" });
    } catch (error) {
        console.error("Update Measurements Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
