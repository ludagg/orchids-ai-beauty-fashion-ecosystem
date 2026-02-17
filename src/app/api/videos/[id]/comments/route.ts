import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { videoComments } from "@/db/schema/content";
import { users } from "@/db/schema/auth";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const comments = await db.query.videoComments.findMany({
            where: eq(videoComments.videoId, id),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: [desc(videoComments.createdAt)]
        });

        return NextResponse.json(comments);

    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const commentId = nanoid();
        const newComment = await db.insert(videoComments).values({
            id: commentId,
            userId: session.user.id,
            videoId: id,
            content: content.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        // Fetch user details to return with the comment for immediate UI update
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                id: true,
                name: true,
                image: true
            }
        });

        return NextResponse.json({
            ...newComment[0],
            user
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
