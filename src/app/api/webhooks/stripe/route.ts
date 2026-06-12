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
    case "checkout.session.completed": {
      const session = event.data.object;

      if (session.mode === "subscription") {
        const userId = session.metadata?.userId;
        if (userId) {
          await db.update(users).set({
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          }).where(eq(users.id, userId));
          console.log(`Updated user ${userId} with new subscription ${session.subscription}`);
        }
      }
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;

      if (invoice.subscription) {
        // Find user by customer ID and update subscription period end
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

        await db.update(users).set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        }).where(eq(users.stripeCustomerId, invoice.customer as string));

        console.log(`Updated subscription ${invoice.subscription} period end`);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;

      await db.update(users).set({
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      }).where(eq(users.stripeCustomerId, subscription.customer as string));

      console.log(`Cancelled subscription ${subscription.id}`);
      break;
    }
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
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
