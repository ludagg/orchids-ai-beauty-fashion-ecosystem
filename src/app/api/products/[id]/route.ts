import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, salons } from "@/db/schema";
import { reviews } from "@/db/schema/reviews";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().int().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  images: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch product with salon info
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        salon: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch recent reviews for this product
    const productReviews = await db.query.reviews.findMany({
        where: eq(reviews.productId, id),
        with: {
            user: {
                columns: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        },
        orderBy: [desc(reviews.createdAt)],
        limit: 5
    });

    return NextResponse.json({ ...product, reviews: productReviews });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const result = productUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    // 1. Fetch product to get salonId
    const product = await db
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);

    if (product.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const targetProduct = product[0];

    // 2. Check if user owns the salon
    if (!targetProduct.salonId) {
        return NextResponse.json({ error: "Forbidden: Cannot edit platform products" }, { status: 403 });
    }

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
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
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

// DELETE /api/products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        .where(eq(products.id, id))
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
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
