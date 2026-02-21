import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { salons } from "@/db/schema/salons";
import { eq } from "drizzle-orm";
import { StaffManager } from "@/components/partner-dashboard/StaffManager";

export default async function BusinessStaffPage() {
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

  return <StaffManager salonId={salon.id} />;
}
