import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creators, videos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const TEST_USER_ID = "user_123";

export async function GET() {
  try {
    const creator = await db.select().from(creators).where(eq(creators.userId, TEST_USER_ID)).limit(1);

    if (!creator.length) {
      return NextResponse.json([]);
    }

    const creatorVideos = await db
      .select()
      .from(videos)
      .where(eq(videos.creatorId, creator[0].id))
      .orderBy(desc(videos.createdAt));

    return NextResponse.json(creatorVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, url, thumbnailUrl } = body;

    // Ensure Creator exists
    let creator = await db.select().from(creators).where(eq(creators.userId, TEST_USER_ID)).limit(1);

    if (!creator.length) {
        return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
    }

    const newVideo = await db.insert(videos).values({
      id: crypto.randomUUID(),
      creatorId: creator[0].id,
      title,
      description,
      url: url || "https://example.com/video.mp4", // Default for testing
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0
    }).returning();

    return NextResponse.json(newVideo[0]);
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
