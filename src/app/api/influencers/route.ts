import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { influencerProfiles, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";

const createProfileSchema = z.object({
    niche: z.array(z.string()).optional(),
    followerCount: z.number().optional(),
    engagementRate: z.number().optional(),
    mediaKitUrl: z.string().url().optional().or(z.literal("")),
    metrics: z.object({
        instagramFollowers: z.number().optional(),
        tiktokFollowers: z.number().optional(),
        youtubeSubscribers: z.number().optional(),
        averageViews: z.number().optional(),
    }).optional()
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const isVerified = searchParams.get("isVerified");

        let query = db.select({
            id: influencerProfiles.id,
            userId: influencerProfiles.userId,
            niche: influencerProfiles.niche,
            followerCount: influencerProfiles.followerCount,
            engagementRate: influencerProfiles.engagementRate,
            isVerified: influencerProfiles.isVerified,
            user: {
                name: users.name,
                image: users.image
            }
        })
        .from(influencerProfiles)
        .innerJoin(users, eq(influencerProfiles.userId, users.id))
        .orderBy(desc(influencerProfiles.followerCount))
        .limit(limit);

        if (isVerified === "true") {
             // We can't do dynamic where easily like this with query builder, let's just do it simple
             const profiles = await db.query.influencerProfiles.findMany({
                 where: eq(influencerProfiles.isVerified, true),
                 with: {
                     user: {
                         columns: {
                             name: true,
                             image: true
                         }
                     }
                 },
                 orderBy: [desc(influencerProfiles.followerCount)],
                 limit: limit
             });
             return NextResponse.json(profiles);
        }

        const profiles = await query;
        return NextResponse.json(profiles);
    } catch (error) {
        console.error("Error fetching influencer profiles:", error);
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
        const result = createProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
        }

        const existingProfile = await db.query.influencerProfiles.findFirst({
            where: eq(influencerProfiles.userId, session.user.id)
        });

        if (existingProfile) {
             // Update existing
             const updated = await db.update(influencerProfiles).set({
                 ...result.data,
                 updatedAt: new Date()
             }).where(eq(influencerProfiles.id, existingProfile.id)).returning();
             return NextResponse.json(updated[0]);
        }

        const newProfile = await db.insert(influencerProfiles).values({
            id: nanoid(),
            userId: session.user.id,
            ...result.data
        }).returning();

        return NextResponse.json(newProfile[0], { status: 201 });

    } catch (error) {
        console.error("Error creating/updating influencer profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
