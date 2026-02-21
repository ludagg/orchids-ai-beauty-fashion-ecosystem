import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { eq } from "drizzle-orm";
import BusinessLayoutClient from "@/components/business/BusinessLayoutClient";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  let userSalon = null;

  if (session?.user?.id) {
    try {
        const results = await db
            .select()
            .from(salons)
            .where(eq(salons.ownerId, session.user.id))
            .limit(1);

        if (results.length > 0) {
            userSalon = results[0];
        }
    } catch (error) {
        console.error("Error fetching salon in business layout:", error);
    }
  }

  return (
    <BusinessLayoutClient salon={userSalon}>
      {children}
    </BusinessLayoutClient>
  );
}
