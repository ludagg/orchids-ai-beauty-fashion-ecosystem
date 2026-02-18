import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { salons, services } from "@/db/schema/salons";
import { videos } from "@/db/schema/content";
import { ilike, or, desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query || query.trim().length === 0) {
            return NextResponse.json({
                products: [],
                salons: [],
                videos: [],
                services: []
            });
        }

        const searchTerm = `%${query.trim()}%`;

        // Run queries in parallel
        const [foundProducts, foundSalons, foundVideos, foundServices] = await Promise.all([
            // Search Products
            db.query.products.findMany({
                where: ilike(products.name, searchTerm),
                limit: 10,
                with: {
                    salon: {
                        columns: { name: true, slug: true }
                    }
                },
                orderBy: [desc(products.createdAt)]
            }),
            // Search Salons (Name or City)
            db.query.salons.findMany({
                where: or(
                    ilike(salons.name, searchTerm),
                    ilike(salons.city, searchTerm)
                ),
                limit: 5,
                columns: {
                    id: true,
                    name: true,
                    slug: true,
                    city: true,
                    image: true,
                    type: true
                }
            }),
            // Search Videos (Title)
            db.query.videos.findMany({
                where: ilike(videos.title, searchTerm),
                limit: 10,
                with: {
                    user: {
                        columns: { name: true, image: true }
                    },
                    salon: {
                        columns: { name: true, slug: true }
                    }
                },
                orderBy: [desc(videos.createdAt)]
            }),
             // Search Services
             db.query.services.findMany({
                where: ilike(services.name, searchTerm),
                limit: 5,
                with: {
                    salon: {
                        columns: { name: true, slug: true }
                    }
                },
                orderBy: [desc(services.createdAt)]
            })
        ]);

        return NextResponse.json({
            products: foundProducts,
            salons: foundSalons,
            videos: foundVideos,
            services: foundServices
        });

    } catch (error) {
        console.error("Error performing global search:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
