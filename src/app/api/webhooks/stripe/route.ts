// [Jules - Implementing security standards for webhook secret, replacing console with logger, fixing stock schema field]
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema/commerce";
import { eq, sql, and, ne } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error("Missing STRIPE_WEBHOOK_SECRET configuration.");
    return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
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
            logger.info(`Order ${orderId} already paid or not found. Skipping.`);
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
                  totalStock: sql`${products.totalStock} - ${item.quantity}`,
                })
                .where(eq(products.id, item.productId));
            }
          }

          logger.info(`Order ${orderId} marked as paid.`);
        } catch (dbError) {
          logger.error(`Error updating order/stock: ${dbError}`);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
      break;
    default:
      // Unexpected event type
      logger.info(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
