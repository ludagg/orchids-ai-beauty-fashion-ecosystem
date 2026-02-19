'use server'

import { z } from 'zod';
import { db } from '@/lib/db';
import { salons, users, openingHours } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const BusinessSchema = z.object({
  type: z.enum(['SALON', 'BOUTIQUE']),
  name: z.string().min(2),
  siret: z.string().length(14, { message: "SIRET must be exactly 14 digits" }),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(5),
  phone: z.string().optional(),
  description: z.string().optional(),
});

export async function createBusinessAction(data: any) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const parseResult = BusinessSchema.safeParse(data);

    if (!parseResult.success) {
      return { success: false, error: parseResult.error.errors[0].message };
    }

    const { type, name, siret, address, city, zipCode, phone, description } = parseResult.data;

    // Check if user already owns a salon
    const existingSalon = await db.select().from(salons).where(eq(salons.ownerId, session.user.id));
    if (existingSalon.length > 0) {
      return { success: false, error: "You already have a registered business." };
    }

    const salonId = nanoid();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + nanoid(4);

    await db.transaction(async (tx) => {
      // Create Salon Record
      await tx.insert(salons).values({
        id: salonId,
        ownerId: session.user.id,
        name,
        slug,
        description: description || "",
        siret,
        address,
        city,
        zipCode,
        phone: phone || null,
        type,
        status: 'pending',
        isVerified: false,
      });

      // If Salon, add default opening hours
      if (type === 'SALON') {
        const defaultHours = [];
        for (let i = 0; i <= 6; i++) {
            // 0 = Sunday
            const isClosed = i === 0 || i === 1; // Closed Sun & Mon commonly
            defaultHours.push({
                id: nanoid(),
                salonId,
                dayOfWeek: i,
                openTime: '10:00',
                closeTime: '19:00',
                isClosed
            });
        }
        await tx.insert(openingHours).values(defaultHours);
      }

      // Update User Role
      if (session.user.role !== 'salon_owner') {
          await tx.update(users).set({ role: 'salon_owner' }).where(eq(users.id, session.user.id));
      }
    });

    return { success: true, salonId };

  } catch (error: any) {
    console.error("Error creating business:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
}
