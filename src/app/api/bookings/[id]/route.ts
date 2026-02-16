import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { sendEmail } from '@/lib/email';
import { EmailTemplates } from '@/lib/email-templates';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Fetch Booking with Salon info
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        salon: true,
        user: true, // Need user info for email
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isOwner = booking.salon.ownerId === session.user.id;
    const isUser = booking.userId === session.user.id;

    if (!isOwner && !isUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Authorization Logic
    if (isOwner) {
        // Owners Logic
        if (booking.status === 'cancelled' || booking.status === 'completed') {
             return NextResponse.json({ error: 'Booking is already finalized' }, { status: 400 });
        }
    } else if (isUser) {
        // Users can only cancel
        if (status !== 'cancelled') {
            return NextResponse.json({ error: 'Users can only cancel bookings' }, { status: 403 });
        }
        // Users can only cancel pending or confirmed bookings
        if (!['pending', 'confirmed'].includes(booking.status)) {
             return NextResponse.json({ error: 'Cannot cancel this booking' }, { status: 400 });
        }
    }

    // Update status
    await db.update(bookings)
      .set({
        status: status as any, // Cast to match enum type if needed
        updatedAt: new Date()
      })
      .where(eq(bookings.id, id));

    // Send Cancellation Email
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

    return NextResponse.json({ success: true, status });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
