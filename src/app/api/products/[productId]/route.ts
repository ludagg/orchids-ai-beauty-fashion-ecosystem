import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { salons } from "@/db/schema/salons";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

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

    // 1. Fetch product
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
    // Use 'salons' from commerce schema import
    // Need to verify if 'salons' table object is the same reference or if we need to query it.
    // db.select().from(salons) works if 'salons' is the table definition.

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

export async function PATCH(
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

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validation = updateProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.format() },
        { status: 400 }
      );
    }

    // 1. Fetch product
    const product = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

    if (product.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const targetProduct = product[0];

    // 2. Verify ownership
    const salon = await db
        .select()
        .from(salons)
        .where(and(eq(salons.id, targetProduct.salonId), eq(salons.ownerId, session.user.id)))
        .limit(1);

    if (salon.length === 0) {
        return NextResponse.json({ error: "Forbidden: You do not own this product" }, { status: 403 });
    }

    // 3. Update product
    const updatedProduct = await db
      .update(products)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
