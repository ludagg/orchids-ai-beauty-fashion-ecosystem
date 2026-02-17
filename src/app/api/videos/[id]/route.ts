import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videos } from "@/db/schema/content";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const video = await db.query.videos.findFirst({
            where: eq(videos.id, id),
            with: {
                user: true,
                salon: true,
                products: {
                    with: {
                        product: true
                    }
                }
            }
        });

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const formatted = {
            ...video,
            products: video.products.map((vp: any) => vp.product)
        };

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("Error fetching video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
