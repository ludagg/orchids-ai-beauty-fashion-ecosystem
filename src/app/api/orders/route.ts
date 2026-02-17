import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema/commerce";
import { eq, desc, inArray, sql } from "drizzle-orm";
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
        let itemsToProcess: { productId: string, quantity: number }[] = [];

        if (body.items && Array.isArray(body.items)) {
            itemsToProcess = body.items;
        } else if (body.productId) {
            itemsToProcess = [{ productId: body.productId, quantity: body.quantity || 1 }];
        } else {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (itemsToProcess.length === 0) {
            return NextResponse.json({ error: "No items to order" }, { status: 400 });
        }

        // Aggregate items by productId to handle duplicates correctly
        const aggregatedItems = new Map<string, number>();
        for (const item of itemsToProcess) {
            const current = aggregatedItems.get(item.productId) || 0;
            aggregatedItems.set(item.productId, current + item.quantity);
        }

        const uniqueProductIds = Array.from(aggregatedItems.keys());

        const productsFound = await db.query.products.findMany({
            where: inArray(products.id, uniqueProductIds)
        });

        const productMap = new Map(productsFound.map(p => [p.id, p]));

        let totalAmount = 0;
        const finalOrderItems = [];

        for (const [productId, quantity] of aggregatedItems.entries()) {
            const product = productMap.get(productId);

            if (!product) {
                return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 404 });
            }

            if (product.stock < quantity) {
                return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
            }

            totalAmount += product.price * quantity;
            finalOrderItems.push({
                productId: productId,
                quantity: quantity,
                priceAtPurchase: product.price,
                currentStock: product.stock
            });
        }

        // Create Order
        const orderId = nanoid();

        await db.transaction(async (tx) => {
             // Create Order
            await tx.insert(orders).values({
                id: orderId,
                userId: session.user.id,
                status: 'reserved', // Default for pickup
                totalAmount: totalAmount,
            });

            // Create Order Items and Update Stock
            for (const item of finalOrderItems) {
                await tx.insert(orderItems).values({
                    id: nanoid(),
                    orderId: orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase: item.priceAtPurchase
                });

                // Calculate new stock based on the aggregated quantity
                await tx.update(products)
                    .set({ stock: sql`${products.stock} - ${item.quantity}` })
                    .where(eq(products.id, item.productId));
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
