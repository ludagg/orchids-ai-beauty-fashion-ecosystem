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
  const userSalons = await db
    .select()
    .from(salons)
    .where(eq(salons.ownerId, session.user.id))
    .limit(1);

  const initialSalon = userSalons.length > 0 ? userSalons[0] : null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatorStudioClient
        user={{
          name: session.user.name,
          image: session.user.image || null,
          email: session.user.email,
        }}
        initialSalon={initialSalon}
      />
    </Suspense>
  );
}
