import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { salons, shops } from "@/db/schema";
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

  // Fetch the salon or shop for the current user
  let initialSalon = null;
  try {
    // Check Salons first
    const userSalons = await db
      .select()
      .from(salons)
      .where(eq(salons.ownerId, session.user.id))
      .limit(1);

    if (userSalons.length > 0) {
      initialSalon = { ...userSalons[0], type: "SALON" as const };
    } else {
        // Check Shops
        const userShops = await db
            .select()
            .from(shops)
            .where(eq(shops.ownerId, session.user.id))
            .limit(1);

        if (userShops.length > 0) {
            initialSalon = { ...userShops[0], type: "BOUTIQUE" as const };
        }
    }
  } catch (error) {
    console.error("Error fetching user business:", error);
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
