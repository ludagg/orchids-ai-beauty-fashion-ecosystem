import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { favorites } from "@/db/schema/favorites";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userFavorites = await db.query.favorites.findMany({
            where: eq(favorites.userId, session.user.id),
            with: {
                product: {
                    with: {
                         salon: true
                    }
                },
                salon: true,
                video: {
                    with: {
                        salon: true,
                        user: true
                    }
                }
            },
            orderBy: [desc(favorites.createdAt)]
        });

        return NextResponse.json(userFavorites);

    } catch (error) {
        console.error("Error fetching favorites:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, salonId, videoId } = body;

        if (!productId && !salonId && !videoId) {
            return NextResponse.json({ error: "Product ID, Salon ID, or Video ID is required" }, { status: 400 });
        }

        const id = crypto.randomUUID();

        await db.insert(favorites).values({
            id,
            userId: session.user.id,
            productId: productId || null,
            salonId: salonId || null,
            videoId: videoId || null,
        }).onConflictDoNothing(); // Prevent duplicates gracefully

        return NextResponse.json({ success: true, id }, { status: 201 });

    } catch (error) {
        console.error("Error adding favorite:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
     try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const favoriteId = searchParams.get('id');
        const productId = searchParams.get('productId');
        const salonId = searchParams.get('salonId');
        const videoId = searchParams.get('videoId');

        // Allow deletion by ID OR by target (product/salon/video)
        if (favoriteId) {
             await db.delete(favorites).where(
                eq(favorites.id, favoriteId)
            );
        } else if (productId) {
             await db.delete(favorites).where(
                eq(favorites.productId, productId)
            );
        } else if (salonId) {
             await db.delete(favorites).where(
                eq(favorites.salonId, salonId)
            );
        } else if (videoId) {
             await db.delete(favorites).where(
                eq(favorites.videoId, videoId)
            );
        } else {
             return NextResponse.json({ error: "ID, productId, salonId or videoId required" }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error removing favorite:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
