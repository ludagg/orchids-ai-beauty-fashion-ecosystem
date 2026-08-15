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

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    let customerId = session.user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId as string,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/billing?canceled=true`,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
