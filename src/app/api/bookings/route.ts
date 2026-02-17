import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, services, salons, openingHours } from "@/db/schema";
import { eq, and, or, lt, gt, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { headers } from "next/headers";
import { getDay } from 'date-fns';
import { sendEmail } from "@/lib/email";
import { EmailTemplates } from "@/lib/email-templates";
import { createNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { salonId, serviceId, startTime, endTime, notes } = body;

        if (!salonId || !serviceId || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return NextResponse.json({ error: "Invalid time range" }, { status: 400 });
        }

        // Start Transaction
        let newBookingId: string | undefined;

        await db.transaction(async (tx) => {
             // 1. Fetch Service
            const service = await tx.query.services.findFirst({
                where: eq(services.id, serviceId)
            });

            if (!service) {
                throw new Error("Service not found");
            }

             // 2. Validate Operating Hours
            const dayOfWeek = getDay(start);
            const salonHours = await tx.query.openingHours.findFirst({
                where: and(
                    eq(openingHours.salonId, salonId),
                    eq(openingHours.dayOfWeek, dayOfWeek)
                )
            });

            if (!salonHours || salonHours.isClosed || !salonHours.openTime || !salonHours.closeTime) {
                throw new Error("Salon is closed on this day");
            }

            // Parse HH:MM to compare
            const [openHour, openMinute] = salonHours.openTime.split(':').map(Number);
            const [closeHour, closeMinute] = salonHours.closeTime.split(':').map(Number);

            const openDateTime = new Date(start);
            openDateTime.setHours(openHour, openMinute, 0, 0);

            const closeDateTime = new Date(start);
            closeDateTime.setHours(closeHour, closeMinute, 0, 0);

            if (start < openDateTime || end > closeDateTime) {
                throw new Error("Booking time is outside operating hours");
            }

            // 3. Check Overlaps
            const conflicts = await tx.query.bookings.findMany({
                where: and(
                    eq(bookings.salonId, salonId),
                    // We check for any overlap.
                    // (StartA < EndB) and (EndA > StartB)
                    lt(bookings.startTime, end),
                    gt(bookings.endTime, start),
                    // Only consider active bookings
                    or(
                        eq(bookings.status, 'pending'),
                        eq(bookings.status, 'confirmed')
                    )
                )
            });

            if (conflicts.length > 0) {
                 throw new Error("Time slot already booked");
            }

            // 4. Create Booking
            newBookingId = nanoid();
            await tx.insert(bookings).values({
                id: newBookingId,
                userId: session.user.id,
                salonId,
                serviceId,
                startTime: start,
                endTime: end,
                status: 'pending',
                totalPrice: service.price,
                notes
            });
        });

        if (newBookingId) {
             // Send Confirmation Email asynchronously
            (async () => {
                try {
                    const bookingDetails = await db.query.bookings.findFirst({
                        where: eq(bookings.id, newBookingId),
                        with: {
                            salon: true,
                            service: true
                        }
                    });

                    if (bookingDetails) {
                        // Notify Salon Owner
                        if (bookingDetails.salon.ownerId) {
                            await createNotification({
                                userId: bookingDetails.salon.ownerId,
                                type: 'booking',
                                title: 'New Booking Request',
                                message: `New booking for ${bookingDetails.service.name} by ${session.user.name || 'a user'}`,
                                link: `/partner-dashboard/bookings`,
                                metadata: { bookingId: newBookingId }
                            });
                        }

                        // Notify Booker (User)
                        await createNotification({
                            userId: session.user.id,
                            type: 'booking',
                            title: 'Booking Confirmed',
                            message: `Your booking for ${bookingDetails.service.name} at ${bookingDetails.salon.name} is confirmed.`,
                            link: `/app/bookings`,
                            metadata: { bookingId: newBookingId }
                        });

                        if (session.user?.email) {
                            const html = EmailTemplates.bookingConfirmation(bookingDetails, session.user);
                            await sendEmail({
                                to: session.user.email,
                                subject: `Booking Confirmed at ${bookingDetails.salon.name}`,
                                html
                            });
                        }
                    }
                } catch (emailError) {
                    console.error("Failed to send confirmation email or notification", emailError);
                }
            })();

            return NextResponse.json({ success: true, bookingId: newBookingId }, { status: 201 });
        } else {
             return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userBookings = await db.query.bookings.findMany({
            where: eq(bookings.userId, session.user.id),
            with: {
                salon: true,
                service: true,
            },
            orderBy: [desc(bookings.startTime)]
        });

        return NextResponse.json(userBookings);

    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
