import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema/commerce";
import { eq, sql, and, ne } from "drizzle-orm";
import { log } from "@/lib/logger";

interface StripeError extends Error {
  message: string;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    log.error("Stripe webhook missing signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    log.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    const stripeErr = err as StripeError;
    log.error("Webhook signature verification failed", stripeErr);
    return NextResponse.json({ error: `Webhook Error: ${stripeErr.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        try {
          // Update order status (Idempotent check)
          const updatedOrders = await db
            .update(orders)
            .set({ status: "paid" })
            .where(and(eq(orders.id, orderId), ne(orders.status, "paid")))
            .returning({ id: orders.id });

          if (updatedOrders.length === 0) {
            log.info("Order already paid or not found, skipping", { orderId });
            return NextResponse.json({ received: true });
          }

          // Decrement stock
          const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
            with: {
              items: true,
            },
          });

          if (order?.items) {
            for (const item of order.items) {
              await db
                .update(products)
                .set({
                  stock: sql`${products.stock} - ${item.quantity}`,
                })
                .where(eq(products.id, item.productId));
            }
          }

          log.info("Order marked as paid", { orderId });
        } catch (dbError) {
          log.error("Error updating order/stock", dbError, { orderId });
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
      break;
    }
    default: {
      // Unexpected event type
      log.warn("Unhandled Stripe event type", { eventType: event.type });
    }
  }

  return NextResponse.json({ received: true });
}
