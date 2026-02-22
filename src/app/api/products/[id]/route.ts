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
  brand: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),

  mainCategory: z.string().optional(),
  subcategory: z.string().optional(),
  productType: z.enum(['PHYSICAL', 'DIGITAL']).optional(),
  tags: z.array(z.string()).optional(),

  originalPrice: z.number().int().nonnegative().optional(),
  salePrice: z.number().int().nonnegative().optional().nullable(),
  saleStartDate: z.string().datetime().optional().nullable(),
  saleEndDate: z.string().datetime().optional().nullable(),
  sku: z.string().optional(),
  totalStock: z.number().int().nonnegative().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  trackInventory: z.boolean().optional(),

  colors: z.array(z.any()).optional(),
  sizes: z.array(z.any()).optional(),
  variants: z.array(z.any()).optional(),

  mainImageUrl: z.string().url().optional(),
  galleryUrls: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional().nullable(),

  weightGrams: z.number().int().nonnegative().optional(),
  dimensions: z.object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional()
  }).optional(),
  material: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  careInstructions: z.string().optional(),

  processingTime: z.string().optional(),
  shippingRegions: z.array(z.string()).optional(),
  freeShipping: z.boolean().optional(),
  shippingCost: z.number().int().nonnegative().optional(),
  returnPolicy: z.string().optional(),
  returnConditions: z.string().optional(),

  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'DRAFT', 'SCHEDULED']).optional(),
  publishDate: z.string().datetime().optional().nullable(),
  featured: z.boolean().optional(),
  status: z.enum(['PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'SUSPENDED']).optional(),
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

    const data = result.data;

    // Parse dates if present
    const updateData: any = { ...data };
    if (data.saleStartDate) updateData.saleStartDate = new Date(data.saleStartDate);
    if (data.saleEndDate) updateData.saleEndDate = new Date(data.saleEndDate);
    if (data.publishDate) updateData.publishDate = new Date(data.publishDate);

    // 3. Update product
    const updatedProduct = await db
      .update(products)
      .set({
        ...updateData,
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
