import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { eq } from "drizzle-orm";
import BusinessSettingsContent from "@/components/business/BusinessSettingsContent";

export default async function BusinessSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const userSalons = await db
    .select()
    .from(salons)
    .where(eq(salons.ownerId, session.user.id))
    .limit(1);

  if (userSalons.length === 0) {
    redirect("/business/register");
  }

  const salon = userSalons[0];

  return <BusinessSettingsContent salonId={salon.id} />;
}
