import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversations, salons, users, messages } from "@/db/schema";
import { eq, or, inArray, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // 1. Find all salons owned by this user
        const mySalons = await db.query.salons.findMany({
            where: eq(salons.ownerId, userId),
            columns: { id: true }
        });
        const mySalonIds = mySalons.map(s => s.id);

        // 2. Find conversations where:
        // - User is the participant (customer side)
        // - OR Salon is one of the user's salons (business side)
        const whereClause = mySalonIds.length > 0
            ? or(
                eq(conversations.userId, userId),
                inArray(conversations.salonId, mySalonIds)
              )
            : eq(conversations.userId, userId);

        const userConversations = await db.query.conversations.findMany({
            where: whereClause,
            with: {
                salon: true,
                user: true, // The customer
                // We want the last message, but Drizzle's `with` limit is tricky for "last per group".
                // We'll fetch messages separately or just get all and filter in app (not scalable but ok for now)
                // Or better: use `orderBy` on the conversation itself since we update `lastMessageAt`.
            },
            orderBy: [desc(conversations.lastMessageAt)]
        });

        // 3. For each conversation, fetch the last message and unread count
        // This is N+1 but Drizzle doesn't support complex aggregations in `query` builder easily yet.
        const enrichedConversations = await Promise.all(userConversations.map(async (conv) => {
            const lastMessage = await db.query.messages.findFirst({
                where: eq(messages.conversationId, conv.id),
                orderBy: [desc(messages.createdAt)]
            });

            // Count unread messages
            // If I am the Customer (conv.userId === userId), I want unread messages from the Salon (sender != userId)
            // If I am the Salon (mySalonIds.includes(conv.salonId)), I want unread messages from the Customer (sender == conv.userId)

            // Logic: count messages where conversationId = id AND isRead = false AND senderId != userId
            // Wait, if I am the salon owner, I am also a User. The senderId of a message from me (as salon owner) is still my userId.
            // So:
            // Message from Customer: senderId = conv.userId.
            // Message from Salon: senderId = salonOwnerId.

            // If I am the Viewer:
            // I want to see unread messages where senderId != Me.

            // Note: If I am the salon owner, and I send a message, senderId is Me.
            // So unread are messages where senderId != Me.

            // However, we need to know who the "Other" party is to display correct Name/Avatar.
            let otherParty;
            if (conv.userId === userId) {
                // I am the customer, talking to Salon
                otherParty = {
                    id: conv.salon?.id || '',
                    name: conv.salon?.name || 'Unknown',
                    image: conv.salon?.image || null, // Salon image
                    type: 'Salon'
                };
            } else {
                // I am the salon owner, talking to Customer
                otherParty = {
                    id: conv.user.id,
                    name: conv.user.name,
                    image: conv.user.image,
                    type: 'Customer' // or User
                };
            }

            const unreadCount = (await db.query.messages.findMany({
                where: and(
                    eq(messages.conversationId, conv.id),
                    eq(messages.isRead, false)
                    // We need to filter by sender != Me.
                    // But `findMany` doesn't support `ne` (not equal) easily in strict types sometimes, let's check.
                    // Actually, we can just filter in JS for the count since we don't expect thousands of unread.
                    // Or use `not(eq(...))`
                )
            })).filter(m => m.senderId !== userId).length;

            return {
                ...conv,
                lastMessage,
                unreadCount,
                otherParty
            };
        }));

        return NextResponse.json(enrichedConversations);

    } catch (error) {
        console.error("Error fetching conversations:", error);
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
        const { salonId, initialMessage } = body;

        if (!salonId) {
            return NextResponse.json({ error: "Salon ID is required" }, { status: 400 });
        }

        // Check if conversation already exists
        let conversationId: string;
        const existing = await db.query.conversations.findFirst({
            where: and(
                eq(conversations.userId, session.user.id),
                eq(conversations.salonId, salonId)
            )
        });

        if (existing) {
            conversationId = existing.id;
        } else {
            // Create new
            const newId = nanoid();
            await db.insert(conversations).values({
                id: newId,
                userId: session.user.id,
                salonId: salonId,
                lastMessageAt: new Date(),
            });
            conversationId = newId;
        }

        if (initialMessage && typeof initialMessage === 'string' && initialMessage.trim().length > 0) {
            await db.insert(messages).values({
                id: nanoid(),
                conversationId: conversationId,
                senderId: session.user.id,
                content: initialMessage,
                isRead: false,
                createdAt: new Date(),
            });

            await db.update(conversations)
                .set({ lastMessageAt: new Date() })
                .where(eq(conversations.id, conversationId));
        }

        return NextResponse.json({ id: conversationId }, { status: 201 });

    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
