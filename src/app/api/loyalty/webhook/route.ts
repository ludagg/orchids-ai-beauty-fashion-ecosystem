import { NextRequest, NextResponse } from "next/server";
import { LoyaltyEngine } from "@/lib/loyalty";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, userId, data } = body;

        // Basic validation
        if (!type || !userId || !data) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Ideally verify signature here
        // const signature = req.headers.get("x-signature");
        // verify(signature, body, process.env.WEBHOOK_SECRET);

        if (type === 'booking.completed') {
            const { bookingId, amount } = data; // amount in cents/smallest unit? or currency?
            // Assuming amount is in currency (e.g. INR 1500)
            // Rules: 10 pts / 100 spent

            const pointsBase = Math.floor((amount || 0) / 100) * 10;

            if (pointsBase > 0) {
                 await LoyaltyEngine.addPoints(
                    userId,
                    pointsBase,
                    'earned_booking',
                    `Booking Completed #${bookingId}`,
                    bookingId
                );
            }

            return NextResponse.json({ success: true, pointsAwarded: pointsBase });
        }

        return NextResponse.json({ message: "Event ignored" });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
