import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { salons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import ProfileView from "./ProfileView";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/auth");
  }

  // Check if the user is a salon owner
  let isSalonOwner = false;
  try {
    const userSalons = await db
      .select({ id: salons.id })
      .from(salons)
      .where(eq(salons.ownerId, session.user.id))
      .limit(1);

    if (userSalons.length > 0) {
      isSalonOwner = true;
    }
  } catch (error) {
    console.error("Error checking user salon ownership:", error);
    // isSalonOwner remains false
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileView
        user={{
          name: session.user.name,
          image: session.user.image || null,
          email: session.user.email,
          id: session.user.id,
          loyaltyPoints: (session.user as any).loyaltyPoints as number,
          createdAt: session.user.createdAt,
        }}
        isSalonOwner={isSalonOwner}
      />
    </Suspense>
  );
}
