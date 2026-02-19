import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Adjust import if needed
import { db } from '@/lib/db'; // Adjust import if needed
import { users, userPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { profile, interests, style, budget, fit, completed } = body;

    // Update User (Image & Onboarding Status)
    const updateData: any = {
      onboardingCompleted: true, // Mark as completed
    };

    if (profile.image && profile.image.startsWith('data:image')) {
      updateData.image = profile.image;
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id));

    // Save Preferences
    // Check if preferences already exist
    const existingPrefs = await db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, session.user.id)
    });

    const prefData = {
      userId: session.user.id,
      dob: profile.dob ? new Date(profile.dob) : null,
      gender: profile.gender || null,
      city: profile.city || null,
      interests: interests || [],
      style: style || [],
      budget: budget || null,
      height: fit.height ? parseInt(fit.height) : null,
      weight: fit.weight ? parseInt(fit.weight) : null,
      morphology: fit.morphology || null,
      updatedAt: new Date(),
    };

    if (existingPrefs) {
        await db.update(userPreferences)
            .set(prefData)
            .where(eq(userPreferences.id, existingPrefs.id));
    } else {
        await db.insert(userPreferences).values({
            id: nanoid(),
            ...prefData,
            createdAt: new Date(),
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
