import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, services, salons, openingHours, staff, staffServices } from "@/db/schema";
import { eq, and, or, lt, gt, desc, inArray } from 'drizzle-orm';
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
        const { salonId, serviceId, startTime, endTime, notes, staffId } = body;

        if (!salonId || !serviceId || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return NextResponse.json({ error: "Invalid time range" }, { status: 400 });
        }

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

            const [openHour, openMinute] = salonHours.openTime.split(':').map(Number);
            const [closeHour, closeMinute] = salonHours.closeTime.split(':').map(Number);

            const openDateTime = new Date(start);
            openDateTime.setHours(openHour, openMinute, 0, 0);

            const closeDateTime = new Date(start);
            closeDateTime.setHours(closeHour, closeMinute, 0, 0);

            if (start < openDateTime || end > closeDateTime) {
                throw new Error("Booking time is outside operating hours");
            }

            // 3. Identify Staff
            let assignedStaffId = staffId;

            if (assignedStaffId) {
                // Verify staff exists, belongs to salon, and performs service
                const staffMember = await tx.query.staff.findFirst({
                    where: and(
                        eq(staff.id, assignedStaffId),
                        eq(staff.salonId, salonId),
                        eq(staff.isActive, true)
                    )
                });

                if (!staffMember) throw new Error("Staff member not found or inactive");

                const performsService = await tx.query.staffServices.findFirst({
                    where: and(
                        eq(staffServices.staffId, assignedStaffId),
                        eq(staffServices.serviceId, serviceId)
                    )
                });

                if (!performsService) throw new Error("Staff member does not perform this service");

            } else {
                // "Any" selected: Find available staff
                // Get all staff who perform this service
                const qualifiedStaff = await tx
                    .select({ id: staff.id })
                    .from(staff)
                    .innerJoin(staffServices, eq(staff.id, staffServices.staffId))
                    .where(and(
                        eq(staff.salonId, salonId),
                        eq(staff.isActive, true),
                        eq(staffServices.serviceId, serviceId)
                    ));

                if (qualifiedStaff.length === 0) {
                     throw new Error("No staff members available for this service");
                }

                // Check availability for each until one is found
                for (const s of qualifiedStaff) {
                     const conflict = await tx.query.bookings.findFirst({
                        where: and(
                            eq(bookings.staffId, s.id),
                            or(
                                eq(bookings.status, 'confirmed'),
                                eq(bookings.status, 'pending')
                            ),
                            lt(bookings.startTime, end),
                            gt(bookings.endTime, start)
                        )
                    });

                    if (!conflict) {
                        assignedStaffId = s.id;
                        break;
                    }
                }

                if (!assignedStaffId) {
                    throw new Error("No staff members available at this time");
                }
            }

            // 4. Final Availability Check (Redundant if "Any" logic worked, but safe for specific staff)
            const conflict = await tx.query.bookings.findFirst({
                where: and(
                    eq(bookings.staffId, assignedStaffId),
                    or(
                        eq(bookings.status, 'confirmed'),
                        eq(bookings.status, 'pending')
                    ),
                    lt(bookings.startTime, end),
                    gt(bookings.endTime, start)
                )
            });

            if (conflict) {
                 throw new Error("Selected staff member is already booked");
            }

            // 5. Create Booking
            newBookingId = nanoid();
            await tx.insert(bookings).values({
                id: newBookingId,
                userId: session.user.id,
                salonId,
                serviceId,
                staffId: assignedStaffId,
                startTime: start,
                endTime: end,
                status: 'pending',
                totalPrice: service.price,
                notes
            });
        });

        // ... Notification logic (same as before) ...
        if (newBookingId) {
            // Send Confirmation Email asynchronously
            (async () => {
                try {
                    const bookingDetails = await db.query.bookings.findFirst({
                        where: eq(bookings.id, newBookingId),
                        with: {
                            salon: true,
                            service: true,
                            staff: true // Include staff details
                        }
                    });

                    if (bookingDetails) {
                        if (bookingDetails.salon.ownerId) {
                            await createNotification({
                                userId: bookingDetails.salon.ownerId,
                                type: 'booking',
                                title: 'New Booking Request',
                                message: `New booking for ${bookingDetails.service.name} with ${bookingDetails.staff?.name || 'Staff'}`,
                                link: `/partner-dashboard/bookings`,
                                metadata: { bookingId: newBookingId }
                            });
                        }

                        await createNotification({
                            userId: session.user.id,
                            type: 'booking',
                            title: 'Booking Confirmed',
                            message: `Your booking for ${bookingDetails.service.name} with ${bookingDetails.staff?.name} is confirmed.`,
                            link: `/app/bookings`,
                            metadata: { bookingId: newBookingId }
                        });

                        // Note: EmailTemplates might need update to show staff name, but existing won't break
                        if (session.user?.email) {
                            // Mocking email template update or assuming it handles extra fields gracefully
                            // For now, pass bookingDetails as is.
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
