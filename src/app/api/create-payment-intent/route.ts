// [Jules - Fixed schema inconsistencies: changed product.stock to totalStock and product.price to salePrice/originalPrice. Updated to Pino logger.]
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth"; // Import users for loyalty points update later
import { eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Fetch products from DB to validate prices
    const itemIds = items.map((item: any) => item.id);
    const dbProducts = await db.query.products.findMany({
      where: inArray(products.id, itemIds),
    });

    if (dbProducts.length !== items.length) {
       // Some products might be missing or IDs incorrect
       // For now proceed with what we found, or error out.
       // Let's error out for safety.
       // However, to be robust, we should map found products.
    }

    let totalAmount = 0;
    const validatedItems = [];

    // Memory optimization: Convert inner Array.find() to Map lookup O(N*M) -> O(N+M)
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 400 });
      }
      if (product.totalStock < item.quantity) {
          return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      const effectivePrice = product.salePrice ?? product.originalPrice;
      totalAmount += effectivePrice * item.quantity;
      validatedItems.push({
        ...item,
        price: effectivePrice
      });
    }

    // Add shipping if applicable (hardcoded logic matching frontend for now)
    // Frontend logic: > 5000 -> 0, else 150
    // Price is in cents. 5000 INR = 500000 cents.
    // 150 INR = 15000 cents.

    // Check if totalAmount > 500000
    const shippingCost = totalAmount > 500000 ? 0 : 15000;

    // Add Tax (18%)
    const tax = Math.round(totalAmount * 0.18);

    const finalTotal = totalAmount + shippingCost + tax;

    // 2. Create Pending Order
    const orderId = nanoid();

    // Use transaction
    await db.transaction(async (tx) => {
        await tx.insert(orders).values({
            id: orderId,
            userId: session.user.id,
            status: 'pending',
            totalAmount: finalTotal,
            shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
        });

        if (validatedItems.length > 0) {
            const batchItems = validatedItems.map((item) => ({
                id: nanoid(),
                orderId: orderId,
                productId: item.id,
                quantity: item.quantity,
                priceAtPurchase: item.price
            }));
            await tx.insert(orderItems).values(batchItems);
        }
    });

    // 3. Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalTotal,
      currency: "inr",
      metadata: {
        orderId: orderId,
        userId: session.user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 4. Update Order with PaymentIntent ID
    await db.update(orders)
        .set({ stripePaymentIntentId: paymentIntent.id })
        .where(eq(orders.id, orderId));

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId
    });

  } catch (error: any) {
    logger.error({ err: error }, "Error creating payment intent");
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
