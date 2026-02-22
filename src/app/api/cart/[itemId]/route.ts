import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cartItems } from "@/db/schema/cart";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const { quantity } = await req.json();

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, itemId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;

    await db.delete(cartItems).where(eq(cartItems.id, itemId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
