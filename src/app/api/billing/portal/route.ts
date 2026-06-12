import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { stripeCustomerId: true }
    });

    if (!user || !user.stripeCustomerId) {
         return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.headers.get("origin") || "http://localhost:3000"}/app/billing`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error("Stripe portal error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
