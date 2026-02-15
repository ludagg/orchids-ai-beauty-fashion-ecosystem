import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, salons } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().int().nonnegative("Price must be a non-negative integer (cents)"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
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

    const salonProducts = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.salonId, salonId),
          eq(products.isActive, true)
        )
      )
      .orderBy(desc(products.createdAt));

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

    const { name, price, stock, description, images } = result.data;

    const newProduct = await db
      .insert(products)
      .values({
        id: nanoid(),
        salonId: salonId,
        name,
        price, // cents
        stock,
        description: description || null,
        images: images || [],
        isActive: true,
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
