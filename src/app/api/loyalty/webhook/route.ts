// [Jules - Updated webhook route to enforce HMAC-SHA256 signature verification and properly format point calculation based on smallest currency unit]
import { NextRequest, NextResponse } from "next/server";
import { LoyaltyEngine } from "@/lib/loyalty";
import { verifyWebhookSignature } from "@/lib/crypto";

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-signature");

        if (!verifyWebhookSignature(signature, rawBody, process.env.WEBHOOK_SECRET)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const { type, userId, data } = body;

        // Basic validation
        if (!type || !userId || !data) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (type === 'booking.completed') {
            const { bookingId, amount } = data;

            // Amount is in smallest unit (e.g. paise), so amount/100 is currency unit (e.g. INR).
            // 10 pts / 100 spent (INR) -> pointsBase = Math.floor((amount / 100) / 100) * 10
            const pointsBase = Math.floor((amount || 0) / 10000) * 10;

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
