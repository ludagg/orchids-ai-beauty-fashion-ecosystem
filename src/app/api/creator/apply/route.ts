import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creators, users } from "@/db/schema"; // Assuming users table exists
import { eq } from "drizzle-orm";

const TEST_USER_ID = "user_123";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bio, socialLinks } = body;

    // 1. Ensure User exists (for testing purposes)
    const existingUser = await db.select().from(users).where(eq(users.id, TEST_USER_ID)).limit(1);
    if (!existingUser.length) {
        await db.insert(users).values({
            id: TEST_USER_ID,
            email: "test@example.com",
            name: "Test User",
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    // 2. Check if Creator profile exists
    const existingCreator = await db.select().from(creators).where(eq(creators.userId, TEST_USER_ID)).limit(1);

    if (existingCreator.length) {
        // Update existing application?
        return NextResponse.json({ message: "Already applied", creator: existingCreator[0] });
    }

    // 3. Create Creator Profile
    const newCreator = await db.insert(creators).values({
        id: crypto.randomUUID(),
        userId: TEST_USER_ID,
        bio,
        socialLinks: JSON.stringify(socialLinks),
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      creator: newCreator[0]
    });
  } catch (error) {
    console.error("Error applying:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
