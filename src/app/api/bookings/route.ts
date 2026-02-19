import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, services, salons, openingHours, staff, staffHours, staffTimeOff, clientProfiles } from "@/db/schema";
import { eq, and, or, lt, gt, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { headers } from "next/headers";
import { getDay, startOfDay, endOfDay } from 'date-fns';
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
        const { salonId, serviceId, staffId, startTime, endTime, notes, source } = body;

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

            // 2. Validate Staff if specified
            let staffMember = null;
            if (staffId) {
                staffMember = await tx.query.staff.findFirst({
                    where: and(
                        eq(staff.id, staffId),
                        eq(staff.salonId, salonId),
                        eq(staff.isActive, true),
                        eq(staff.canAcceptBookings, true)
                    )
                });

                if (!staffMember) {
                    throw new Error("Staff member not found or unavailable");
                }

                // Check staff time off
                const dayStart = startOfDay(start);
                const dayEnd = endOfDay(start);
                const timeOff = await tx.query.staffTimeOff.findMany({
                    where: and(
                        eq(staffTimeOff.staffId, staffId),
                        eq(staffTimeOff.isApproved, true),
                        gte(staffTimeOff.endDate, dayStart),
                        lt(staffTimeOff.startDate, dayEnd)
                    )
                });

                if (timeOff.length > 0) {
                    throw new Error("Staff member is on time off");
                }

                // Check staff hours
                const dayOfWeek = getDay(start);
                const staffDayHours = await tx.query.staffHours.findFirst({
                    where: and(
                        eq(staffHours.staffId, staffId),
                        eq(staffHours.dayOfWeek, dayOfWeek)
                    )
                });

                if (staffDayHours && !staffDayHours.isClosed) {
                    const [openHour, openMinute] = staffDayHours.openTime?.split(':').map(Number) || [0, 0];
                    const [closeHour, closeMinute] = staffDayHours.closeTime?.split(':').map(Number) || [0, 0];

                    const openDateTime = new Date(start);
                    openDateTime.setHours(openHour, openMinute, 0, 0);

                    const closeDateTime = new Date(start);
                    closeDateTime.setHours(closeHour, closeMinute, 0, 0);

                    if (start < openDateTime || end > closeDateTime) {
                        throw new Error("Booking time is outside staff working hours");
                    }
                }
            }

             // 3. Validate Operating Hours
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

            // 4. Check Overlaps
            const conflictConditions = [
                eq(bookings.salonId, salonId),
                lt(bookings.startTime, end),
                gt(bookings.endTime, start),
                or(
                    eq(bookings.status, 'pending'),
                    eq(bookings.status, 'confirmed')
                )
            ];

            if (staffId) {
                conflictConditions.push(eq(bookings.staffId, staffId));
            }

            const conflicts = await tx.query.bookings.findMany({
                where: and(...conflictConditions)
            });

            if (conflicts.length > 0) {
                 throw new Error("Time slot already booked");
            }

            // 5. Create Booking
            newBookingId = nanoid();
            await tx.insert(bookings).values({
                id: newBookingId,
                userId: session.user.id,
                salonId,
                serviceId,
                staffId: staffId || null,
                startTime: start,
                endTime: end,
                status: 'pending',
                source: source || 'web',
                totalPrice: service.price,
                notes
            });

            // 6. Update or Create Client Profile for CRM
            const existingProfile = await tx.query.clientProfiles.findFirst({
                where: and(
                    eq(clientProfiles.salonId, salonId),
                    eq(clientProfiles.userId, session.user.id)
                )
            });

            if (existingProfile) {
                // Update existing profile
                await tx.update(clientProfiles)
                    .set({
                        totalVisits: existingProfile.totalVisits + 1,
                        lastVisitAt: start,
                        updatedAt: new Date()
                    })
                    .where(eq(clientProfiles.id, existingProfile.id));
            } else {
                // Create new profile
                await tx.insert(clientProfiles).values({
                    id: nanoid(),
                    salonId,
                    userId: session.user.id,
                    firstVisitAt: start,
                    lastVisitAt: start,
                    totalVisits: 1,
                    totalSpent: 0,
                    preferredStaffId: staffId || null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
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
                        const staffInfo = bookingDetails.staff ? ` with ${bookingDetails.staff.name}` : '';

                        // Notify Salon Owner
                        if (bookingDetails.salon.ownerId) {
                            await createNotification({
                                userId: bookingDetails.salon.ownerId,
                                type: 'booking',
                                title: 'New Booking Request',
                                message: `New booking for ${bookingDetails.service.name}${staffInfo} by ${session.user.name || 'a user'}`,
                                link: `/partner-dashboard/bookings`,
                                metadata: { bookingId: newBookingId }
                            });
                        }

                        // Notify Booker (User)
                        await createNotification({
                            userId: session.user.id,
                            type: 'booking',
                            title: 'Booking Confirmed',
                            message: `Your booking for ${bookingDetails.service.name}${staffInfo} at ${bookingDetails.salon.name} is confirmed.`,
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
                staff: true,
            },
            orderBy: [desc(bookings.startTime)]
        });

        return NextResponse.json(userBookings);

    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
