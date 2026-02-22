import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carts, cartItems } from "@/db/schema/cart";
import { products } from "@/db/schema/commerce";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const activeCart = await db.query.carts.findFirst({
      where: and(eq(carts.userId, userId), eq(carts.status, 'active')),
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
      }
    });

    if (!activeCart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(activeCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { productId, variantId, quantity, selectedOptions } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Get or Create Cart
    let activeCart = await db.query.carts.findFirst({
      where: and(eq(carts.userId, userId), eq(carts.status, 'active')),
    });

    if (!activeCart) {
      const cartId = nanoid();
      const now = new Date();
      await db.insert(carts).values({
        id: cartId,
        userId: userId,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
      activeCart = { id: cartId, userId, status: 'active', createdAt: now, updatedAt: now };
    }

    // 2. Check if item exists
    let itemCondition;
    if (variantId) {
        itemCondition = and(
            eq(cartItems.cartId, activeCart.id),
            eq(cartItems.productId, productId),
            eq(cartItems.variantId, variantId)
        );
    } else {
         itemCondition = and(
            eq(cartItems.cartId, activeCart.id),
            eq(cartItems.productId, productId),
            isNull(cartItems.variantId)
        );
    }

    const existingItem = await db.query.cartItems.findFirst({
      where: itemCondition
    });

    if (existingItem) {
      await db.update(cartItems)
        .set({
            quantity: existingItem.quantity + quantity,
            updatedAt: new Date()
        })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        id: nanoid(),
        cartId: activeCart.id,
        productId,
        variantId: variantId || null,
        selectedOptions,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Return updated cart
    const updatedCart = await db.query.carts.findFirst({
      where: eq(carts.id, activeCart.id),
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
      }
    });

    return NextResponse.json(updatedCart);

  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
