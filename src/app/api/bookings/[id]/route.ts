import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, cancellationPolicies, clientProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import { EmailTemplates } from "@/lib/email-templates";
import { differenceInHours } from "date-fns";

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
        const {
            status,
            cancellationReason,
            internalNotes,
            checkIn,
            complete
        } = body;

        // Fetch Booking to check permissions
        const booking = await db.query.bookings.findFirst({
            where: eq(bookings.id, id),
            with: {
                salon: true,
                user: true,
                staff: true,
                service: true
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

        const updateData: any = {
            updatedAt: new Date()
        };

        // Handle status updates
        if (status) {
            if (!['confirmed', 'cancelled', 'completed', 'no_show'].includes(status)) {
                return NextResponse.json({ error: "Invalid status" }, { status: 400 });
            }

            // Logic based on user type
            if (isOwner) {
                 // Owners can change status freely (but not revert from cancelled/completed usually)
                 if (booking.status === 'cancelled' || booking.status === 'completed') {
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

                 // Check cancellation policy
                 const policy = await db.query.cancellationPolicies.findFirst({
                     where: eq(cancellationPolicies.salonId, booking.salonId)
                 });

                 if (policy) {
                     const hoursUntilBooking = differenceInHours(new Date(booking.startTime), new Date());
                     if (hoursUntilBooking < policy.freeCancellationHours) {
                         // Could charge cancellation fee here
                         console.log(`Late cancellation: ${hoursUntilBooking}h before booking, policy requires ${policy.freeCancellationHours}h`);
                     }
                 }
            }

            updateData.status = status;

            // Track cancellation
            if (status === 'cancelled') {
                updateData.cancelledAt = new Date();
                updateData.cancelledBy = session.user.id;
                updateData.cancellationReason = cancellationReason;
            }

            // Track completion
            if (status === 'completed') {
                updateData.completedAt = new Date();
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

            // Send confirmation email if confirmed by owner
            if (status === 'confirmed' && booking.status === 'pending' && isOwner) {
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
        }

        // Handle check-in (owner only)
        if (checkIn && isOwner) {
            updateData.checkedInAt = new Date();
            updateData.checkedInBy = session.user.id;
        }

        // Handle completion (owner only)
        if (complete && isOwner) {
            updateData.status = 'completed';
            updateData.completedAt = new Date();

            // Update client total spent
            const clientProfile = await db.query.clientProfiles.findFirst({
                where: and(
                    eq(clientProfiles.salonId, booking.salonId),
                    eq(clientProfiles.userId, booking.userId)
                )
            });

            if (clientProfile) {
                await db.update(clientProfiles)
                    .set({
                        totalSpent: clientProfile.totalSpent + booking.totalPrice,
                        updatedAt: new Date()
                    })
                    .where(eq(clientProfiles.id, clientProfile.id));
            }
        }

        // Handle internal notes (owner only)
        if (internalNotes !== undefined && isOwner) {
            updateData.internalNotes = internalNotes;
        }

        // Update booking
        await db.update(bookings)
            .set(updateData)
            .where(eq(bookings.id, id));

        // Return updated booking
        const updatedBooking = await db.query.bookings.findFirst({
            where: eq(bookings.id, id),
            with: {
                salon: true,
                user: true,
                staff: true,
                service: true
            }
        });

        return NextResponse.json({ success: true, booking: updatedBooking });

    } catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
