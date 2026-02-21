import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings } from "@/db/schema/bookings"; // Import bookings schema
import { eq, and, count } from "drizzle-orm";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import { LoyaltyEngine } from "@/lib/loyalty";
import { EmailTemplates } from "@/lib/email-templates";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        // Fetch Booking to check permissions
        const booking = await db.query.bookings.findFirst({
            where: eq(bookings.id, id),
            with: {
                salon: true,
                user: true // Need user info for email
            }
        });

        if (!booking) {
             return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Check if user is the salon owner or the booking user
        const isOwner = booking.salon.ownerId === session.user.id;
        const isUser = booking.userId === session.user.id;

        if (!isOwner && !isUser) {
             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Logic
        if (isOwner) {
             // Owners can change status freely (but not revert from cancelled/completed usually)
             if (booking.status === 'cancelled' || booking.status === 'completed') {
                 // For simplicity, allow re-opening or just block? Let's block for now to keep it sane.
                 return NextResponse.json({ error: "Booking is already finalized" }, { status: 400 });
             }
        } else if (isUser) {
             // Users can only cancel
             if (status !== 'cancelled') {
                 return NextResponse.json({ error: "Users can only cancel bookings" }, { status: 403 });
             }
             // Users can only cancel pending or confirmed
             if (!['pending', 'confirmed'].includes(booking.status)) {
                 return NextResponse.json({ error: "Cannot cancel this booking" }, { status: 400 });
             }
        }

        // Update
        await db.update(bookings)
            .set({
                status: status as any,
                updatedAt: new Date()
            })
            .where(eq(bookings.id, id));

        // Loyalty Logic: Award points on completion
        if (status === 'completed') {
             try {
                 const points = Math.floor((booking.totalPrice || 0) / 1000); // 10 pts per 100 currency units (assuming price in cents)
                 if (points > 0) {
                     await LoyaltyEngine.addPoints(
                         booking.userId,
                         points,
                         'earned_booking',
                         `Booking at ${booking.salon.name}`,
                         booking.id
                     );
                 }

                 // Check badges
                 // Count completed bookings for this user
                 const bookingCountResult = await db.select({ value: count() })
                     .from(bookings)
                     .where(and(
                         eq(bookings.userId, booking.userId),
                         eq(bookings.status, 'completed')
                     ));
                 const bookingCount = bookingCountResult[0]?.value || 0;

                 await LoyaltyEngine.checkBadges(booking.userId, 'booking_completed', {
                     bookingCount,
                     isFirstBooking: bookingCount === 1
                 });
             } catch (loyaltyError) {
                 console.error("Loyalty error:", loyaltyError);
             }
        }

        // Send Email Notification if Cancelled
        if (status === 'cancelled') {
            (async () => {
                try {
                     if (booking.user?.email) {
                        const html = EmailTemplates.bookingCancellation(booking, booking.user);
                        await sendEmail({
                            to: booking.user.email,
                            subject: `Booking Cancelled - ${booking.salon.name}`,
                            html
                        });
                    }
                } catch (emailError) {
                    console.error("Failed to send cancellation email", emailError);
                }
            })();
        }

        // If Confirmed (by owner), send confirmation email again?
        // Maybe, but usually handled on creation or separate trigger.
        // Let's send one just in case it was pending -> confirmed.
        if (status === 'confirmed' && booking.status === 'pending') {
             (async () => {
                try {
                     if (booking.user?.email) {
                        const html = EmailTemplates.bookingConfirmation(booking, booking.user);
                        await sendEmail({
                            to: booking.user.email,
                            subject: `Booking Confirmed - ${booking.salon.name}`,
                            html
                        });
                    }
                } catch (emailError) {
                    console.error("Failed to send confirmation email", emailError);
                }
            })();
        }

        return NextResponse.json({ success: true, status });

    } catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
