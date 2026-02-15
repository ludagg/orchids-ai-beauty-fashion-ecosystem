import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, salons, productVariants } from "@/db/schema";
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

// GET /api/salons/[salonId]/products
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    if (!salonId) {
       return NextResponse.json({ error: "Salon ID is required" }, { status: 400 });
    }

    console.log(`Fetching products for salon: ${salonId}`);
    const salonProducts = await db.query.products.findMany({
      where: and(
        eq(products.salonId, salonId),
        eq(products.isActive, true)
      ),
      orderBy: [desc(products.createdAt)],
      with: {
        variants: true,
      }
    });
    console.log(`Found ${salonProducts.length} products`);

    return NextResponse.json(salonProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/salons/[salonId]/products
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership of the salon
    const salon = await db
      .select()
      .from(salons)
      .where(and(eq(salons.id, salonId), eq(salons.ownerId, session.user.id)))
      .limit(1);

    if (salon.length === 0) {
      return NextResponse.json({ error: "Forbidden: You do not own this salon" }, { status: 403 });
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

    // Use transaction to ensure product and variants are created together
    const newProduct = await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          id: nanoid(),
          salonId: salonId,
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
