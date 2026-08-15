import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth";
import { eq, sql, and, ne } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        try {
          // Update order status (Idempotent check)
          const updatedOrders = await db
            .update(orders)
            .set({ status: "paid" })
            .where(and(eq(orders.id, orderId), ne(orders.status, "paid")))
            .returning({ id: orders.id });

          if (updatedOrders.length === 0) {
            console.log(`Order ${orderId} already paid or not found. Skipping.`);
            return NextResponse.json({ received: true });
          }

          // Decrement stock
          const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
            with: {
              items: true,
            },
          });

          if (order && order.items) {
            for (const item of order.items) {
              await db
                .update(products)
                .set({
                  stock: sql`${products.stock} - ${item.quantity}`,
                })
                .where(eq(products.id, item.productId));
            }
          }

          console.log(`Order ${orderId} marked as paid.`);
        } catch (dbError) {
          console.error("Error updating order/stock:", dbError);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
      break;

    case "checkout.session.completed":
      const checkoutSession = event.data.object as any;
      if (checkoutSession.mode === "subscription") {
        const userId = checkoutSession.metadata?.userId;
        const subscriptionId = checkoutSession.subscription;
        const customerId = checkoutSession.customer;

        if (userId && subscriptionId && customerId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await db.update(users).set({
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }).where(eq(users.id, userId));
          console.log(`Updated subscription for user ${userId}`);
        }
      }
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object as any;
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        await db.update(users).set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        }).where(eq(users.stripeSubscriptionId, invoice.subscription as string));
        console.log(`Refreshed subscription ${invoice.subscription}`);
      }
      break;

    case "customer.subscription.deleted":
    case "customer.subscription.updated":
      const subscription = event.data.object as any;
      const status = subscription.status;
      if (status === "canceled" || status === "unpaid") {
         await db.update(users).set({
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
         }).where(eq(users.stripeSubscriptionId, subscription.id));
         console.log(`Canceled/unpaid subscription ${subscription.id}`);
      } else {
         await db.update(users).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
         }).where(eq(users.stripeSubscriptionId, subscription.id));
         console.log(`Updated subscription ${subscription.id}`);
      }
      break;

    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
