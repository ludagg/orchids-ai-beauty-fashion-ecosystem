import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversations, messages, salons, users } from "@/db/schema";
import { eq, desc, and, ne } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const conversationId = params.id;

        // 1. Fetch Conversation and verify access
        const conversation = await db.query.conversations.findFirst({
            where: eq(conversations.id, conversationId),
            with: {
                salon: true,
                user: true
            }
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const isParticipant = conversation.userId === session.user.id;
        const isSalonOwner = conversation.salon && conversation.salon.ownerId === session.user.id;

        if (!isParticipant && !isSalonOwner) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Fetch Messages
        const msgs = await db.query.messages.findMany({
            where: eq(messages.conversationId, conversationId),
            orderBy: [desc(messages.createdAt)] // Newest first
        });

        // 3. Mark messages as read (where sender != me)
        await db.update(messages)
            .set({ isRead: true })
            .where(
                and(
                    eq(messages.conversationId, conversationId),
                    ne(messages.senderId, session.user.id)
                )
            );

        return NextResponse.json(msgs.reverse()); // Return oldest first for chat UI

    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const conversationId = params.id;
        const body = await req.json();
        const { content } = body;

        if (!content || !content.trim()) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // 1. Verify Access
        const conversation = await db.query.conversations.findFirst({
            where: eq(conversations.id, conversationId),
            with: {
                salon: true
            }
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const isParticipant = conversation.userId === session.user.id;
        const isSalonOwner = conversation.salon && conversation.salon.ownerId === session.user.id;

        if (!isParticipant && !isSalonOwner) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Create Message
        const messageId = nanoid();
        await db.insert(messages).values({
            id: messageId,
            conversationId: conversationId,
            senderId: session.user.id,
            content: content.trim(),
            isRead: false,
            createdAt: new Date(),
        });

        // 3. Update Conversation lastMessageAt
        await db.update(conversations)
            .set({ lastMessageAt: new Date() })
            .where(eq(conversations.id, conversationId));

        return NextResponse.json({ success: true, messageId }, { status: 201 });

    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
