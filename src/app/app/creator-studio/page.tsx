import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { salons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import CreatorStudioClient from "./CreatorStudioClient";

export default async function CreatorStudioPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/auth");
  }

  // Fetch the salon for the current user
  let initialSalon = null;
  try {
    const userSalons = await db
      .select()
      .from(salons)
      .where(eq(salons.ownerId, session.user.id))
      .limit(1);

    if (userSalons.length > 0) {
      initialSalon = userSalons[0];
    }
  } catch (error) {
    console.error("Error fetching user salon:", error);
    // initialSalon remains null, allowing the page to render in "Become a Partner" mode
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatorStudioClient
        user={{
          name: session.user.name,
          image: session.user.image || null,
          email: session.user.email,
          id: session.user.id,
        }}
        initialSalon={initialSalon}
      />
    </Suspense>
  );
}
