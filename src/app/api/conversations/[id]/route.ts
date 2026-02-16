import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversations, salons, users } from "@/db/schema";
import { eq } from "drizzle-orm";
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

        // Determine other party
        let otherParty;
        if (conversation.userId === session.user.id) {
             otherParty = {
                id: conversation.salon?.id || '',
                name: conversation.salon?.name || 'Unknown Salon',
                image: conversation.salon?.image || null,
                type: 'Salon'
            };
        } else {
             otherParty = {
                id: conversation.user.id,
                name: conversation.user.name,
                image: conversation.user.image,
                type: 'User'
            };
        }

        return NextResponse.json({
            ...conversation,
            otherParty
        });

    } catch (error) {
        console.error("Error fetching conversation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
