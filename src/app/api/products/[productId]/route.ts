import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, salons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

// DELETE /api/products/[productId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch product to get salonId
    const product = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

    if (product.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const targetProduct = product[0];

    // 2. Check if user owns the salon
    if (!targetProduct.salonId) {
        return NextResponse.json({ error: "Forbidden: Cannot delete platform products" }, { status: 403 });
    }

    const salon = await db
        .select()
        .from(salons)
        .where(and(eq(salons.id, targetProduct.salonId), eq(salons.ownerId, session.user.id)))
        .limit(1);

    if (salon.length === 0) {
        return NextResponse.json({ error: "Forbidden: You do not own this product" }, { status: 403 });
    }

    // 3. Delete product
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
