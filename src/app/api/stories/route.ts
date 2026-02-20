import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stories, storyMediaType } from "@/db/schema";
import { auth } from "@/lib/auth"; // Assuming auth helper exists
import { headers } from "next/headers";
import { eq, gt, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get active stories (expiresAt > now)
    const now = new Date();

    // Fetch stories with user data
    // Drizzle query builder
    const activeStories = await db.query.stories.findMany({
      where: gt(stories.expiresAt, now),
      with: {
        user: true,
      },
      orderBy: [desc(stories.createdAt)],
    });

    // Group by user
    const groupedStories = activeStories.reduce((acc: any, story: any) => {
      const userId = story.userId;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    return NextResponse.json(Object.values(groupedStories));
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mediaUrl, mediaType = "image" } = body;

    if (!mediaUrl) {
      return NextResponse.json({ error: "Media URL is required" }, { status: 400 });
    }

    // Default expiration: 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const [newStory] = await db.insert(stories).values({
      userId: session.user.id,
      mediaUrl,
      mediaType: mediaType as "image" | "video",
      expiresAt,
    }).returning();

    return NextResponse.json(newStory);
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
