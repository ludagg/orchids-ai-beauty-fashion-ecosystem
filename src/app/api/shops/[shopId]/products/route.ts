import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, shops, productVariants } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

const variantSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  options: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().int().nonnegative("Price must be a non-negative integer (cents)"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  variants: z.array(variantSchema).optional(),
});

// GET /api/shops/[shopId]/products
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const { shopId } = await params;

    if (!shopId) {
       return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    const shopProducts = await db.query.products.findMany({
      where: and(
        eq(products.shopId, shopId),
        eq(products.isActive, true)
      ),
      orderBy: [desc(products.createdAt)],
      with: {
        variants: true,
      }
    });

    return NextResponse.json(shopProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/shops/[shopId]/products
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const { shopId } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership of the shop
    const shop = await db
      .select()
      .from(shops)
      .where(and(eq(shops.id, shopId), eq(shops.ownerId, session.user.id)))
      .limit(1);

    if (shop.length === 0) {
      return NextResponse.json({ error: "Forbidden: You do not own this shop" }, { status: 403 });
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, price, stock, description, images, category, brand, variants } = result.data;
    const hasVariants = variants && variants.length > 0;

    const newProduct = await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          id: nanoid(),
          shopId: shopId,
          name,
          price, // cents
          stock,
          description: description || null,
          images: images || [],
          category: category || null,
          brand: brand || null,
          hasVariants: hasVariants || false,
          isActive: true,
        })
        .returning();

      if (hasVariants) {
        await tx.insert(productVariants).values(
          variants.map((v) => ({
            id: nanoid(),
            productId: product.id,
            name: v.name,
            price: v.price,
            stock: v.stock,
            options: v.options || null,
          }))
        );
      }

      return product;
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
