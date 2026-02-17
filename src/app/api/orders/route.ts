import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth";
import { eq, desc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import { EmailTemplates } from "@/lib/email-templates";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userId, session.user.id),
            with: {
                items: {
                    with: {
                        product: {
                            with: {
                                salon: true
                            }
                        }
                    }
                }
            },
            orderBy: [desc(orders.createdAt)]
        });

        return NextResponse.json(userOrders);

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, quantity = 1 } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // 1. Fetch Product to check stock and price
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.stock < quantity) {
            return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
        }

        // 2. Create Order
        const orderId = nanoid();
        const totalAmount = product.price * quantity;

        // Start transaction (implicitly handled if single operations, but better safe)
        // Drizzle transaction:
        await db.transaction(async (tx) => {
             // Create Order
            await tx.insert(orders).values({
                id: orderId,
                userId: session.user.id,
                status: 'reserved', // Default for pickup
                totalAmount: totalAmount,
                // shippingAddress is nullable now
            });

            // Create Order Item
            await tx.insert(orderItems).values({
                id: nanoid(),
                orderId: orderId,
                productId: productId,
                quantity: quantity,
                priceAtPurchase: product.price
            });

            // Update Stock
            await tx.update(products)
                .set({ stock: product.stock - quantity })
                .where(eq(products.id, productId));

            // Award Loyalty Points (1 point per 1 unit currency i.e. 100 cents)
            const pointsEarned = Math.floor(totalAmount / 100);
            if (pointsEarned > 0) {
                await tx.update(users)
                    .set({ loyaltyPoints: sql`${users.loyaltyPoints} + ${pointsEarned}` })
                    .where(eq(users.id, session.user.id));
            }
        });

        // Send Order Confirmation Email
        (async () => {
            try {
                const orderDetails = await db.query.orders.findFirst({
                    where: eq(orders.id, orderId),
                    with: {
                         items: {
                             with: {
                                 product: true
                             }
                         }
                    }
                });

                if (orderDetails && session.user?.email) {
                    const html = EmailTemplates.orderConfirmation(orderDetails, session.user);
                    await sendEmail({
                        to: session.user.email,
                        subject: `Order Confirmation #${orderDetails.id}`,
                        html
                    });
                }
            } catch (emailError) {
                console.error("Failed to send order confirmation email", emailError);
            }
        })();

        return NextResponse.json({ success: true, orderId }, { status: 201 });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
