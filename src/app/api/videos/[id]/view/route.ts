import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videos } from "@/db/schema/content";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await db.update(videos)
            .set({ views: sql`${videos.views} + 1` })
            .where(eq(videos.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error increments view:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
