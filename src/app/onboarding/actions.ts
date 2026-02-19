'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function updateProfile(data: {
  dateOfBirth?: string,
  gender?: string,
  location?: string,
  image?: string
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // dateOfBirth is expected to be a string or Date.
  // If it's a string, we can pass it directly if it's formatted correctly, or parse it.

  await db.update(users)
    .set({
      dateOfBirth: data.dateOfBirth, // schema expects date string or Date
      gender: data.gender,
      location: data.location,
      image: data.image
    })
    .where(eq(users.id, session.user.id))
}

export async function updatePreferences(data: {
  interests?: string[],
  style?: string[],
  budget?: string,
  height?: number,
  weight?: string,
  bodyType?: string
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  await db.update(users)
    .set({
      interests: data.interests,
      style: data.style,
      budget: data.budget,
      height: data.height,
      weight: data.weight,
      bodyType: data.bodyType
    })
    .where(eq(users.id, session.user.id))
}

export async function completeOnboarding() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  await db.update(users)
    .set({
      onboardingCompleted: true
    })
    .where(eq(users.id, session.user.id))
}
