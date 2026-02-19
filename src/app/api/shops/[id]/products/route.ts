import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, productVariants } from "@/db/schema/commerce";
import { shops } from "@/db/schema/shops";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().min(0),
  category: z.string().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(z.object({
      name: z.string(),
      price: z.number(),
      stock: z.number(),
      options: z.string().optional()
  })).optional()
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const shopId = id;

    if (!shopId) {
      return NextResponse.json(
        { error: "Shop ID is required" },
        { status: 400 }
      );
    }

    // Verify shop exists
    const shop = await db.query.shops.findFirst({
        where: eq(shops.id, shopId),
    });

    if (!shop) {
        return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const shopProducts = await db.query.products.findMany({
      where: and(
        eq(products.shopId, shopId),
        eq(products.isActive, true)
      ),
      orderBy: [desc(products.createdAt)],
    });

    return NextResponse.json(shopProducts);
  } catch (error) {
    console.error("Error fetching shop products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const shopId = id;
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify shop ownership
        const shop = await db.query.shops.findFirst({
            where: and(eq(shops.id, shopId), eq(shops.ownerId, session.user.id)),
        });

        if (!shop) {
            return NextResponse.json({ error: "Shop not found or unauthorized" }, { status: 403 });
        }

        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const result = productSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
        }

        const { name, description, price, stock, category, brand, images, variants } = result.data;
        const productId = nanoid();
        const hasVariants = variants && variants.length > 0;

        const newProduct = await db.insert(products).values({
            id: productId,
            shopId: shopId,
            name,
            description,
            price,
            stock: hasVariants ? 0 : stock,
            hasVariants: !!hasVariants,
            category,
            brand,
            images,
            isActive: true
        }).returning();

        if (hasVariants) {
            for (const v of variants) {
                await db.insert(productVariants).values({
                    id: nanoid(),
                    productId: productId,
                    name: v.name,
                    price: v.price,
                    stock: v.stock,
                    options: v.options
                });
            }
        }

        return NextResponse.json(newProduct[0], { status: 201 });

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
