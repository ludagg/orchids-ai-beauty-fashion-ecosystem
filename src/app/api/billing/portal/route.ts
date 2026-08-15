import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.user.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json({ error: "No customer ID found. Are you subscribed?" }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId as string,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/billing`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
