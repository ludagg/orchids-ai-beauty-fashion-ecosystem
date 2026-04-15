import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema/commerce";
import { logger } from "@/lib/logger"; // [Jules - Use pino logger instead of console.log]
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
    logger.error({ err: err.message }, "Webhook signature verification failed.");
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
            logger.info({ orderId }, "Order already paid or not found. Skipping.");
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
                  totalStock: sql`${products.totalStock} - ${item.quantity}`, // [Jules - Use totalStock instead of stock]
                })
                .where(eq(products.id, item.productId));
            }
          }

          logger.info({ orderId }, "Order marked as paid.");
        } catch (dbError) {
          logger.error({ dbError }, "Error updating order/stock:");
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
      break;
    default:
      // Unexpected event type
      logger.info({ eventType: event.type }, "Unhandled event type");
  }

  return NextResponse.json({ received: true });
}
