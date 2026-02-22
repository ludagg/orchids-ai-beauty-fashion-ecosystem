import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, salons } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
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

    const salonProducts = await db.query.products.findMany({
      where: and(
        eq(products.salonId, salonId)
      ),
      orderBy: [desc(products.createdAt)],
    });

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

    // Verify ownership
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

    const data = result.data;

    // Generate slug if not provided
    let slug = data.slug;
    if (!slug) {
        slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        slug = `${slug}-${nanoid(6)}`;
    }

    // Parse dates if present
    const saleStartDate = data.saleStartDate ? new Date(data.saleStartDate) : null;
    const saleEndDate = data.saleEndDate ? new Date(data.saleEndDate) : null;
    const publishDate = data.publishDate ? new Date(data.publishDate) : null;

    const [newProduct] = await db.insert(products).values({
        id: data.id || nanoid(),
        salonId: salonId,
        name: data.name,
        brand: data.brand || "",
        description: data.description || "",
        shortDescription: data.shortDescription,
        mainCategory: data.mainCategory || "Other",
        subcategory: data.subcategory || "Other",
        productType: data.productType || "PHYSICAL",
        tags: data.tags || [],
        originalPrice: data.originalPrice || 0,
        salePrice: data.salePrice,
        saleStartDate,
        saleEndDate,
        sku: data.sku,
        totalStock: data.totalStock || 0,
        lowStockThreshold: data.lowStockThreshold || 5,
        trackInventory: data.trackInventory ?? true,
        colors: data.colors || [],
        sizes: data.sizes || [],
        variants: data.variants || [],
        mainImageUrl: data.mainImageUrl || "",
        galleryUrls: data.galleryUrls || [],
        videoUrl: data.videoUrl,
        weightGrams: data.weightGrams,
        dimensions: data.dimensions,
        material: data.material,
        countryOfOrigin: data.countryOfOrigin,
        careInstructions: data.careInstructions,
        processingTime: data.processingTime,
        shippingRegions: data.shippingRegions || [],
        freeShipping: data.freeShipping || false,
        shippingCost: data.shippingCost,
        returnPolicy: data.returnPolicy,
        returnConditions: data.returnConditions,
        slug,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        visibility: data.visibility || "DRAFT",
        publishDate,
        featured: data.featured || false,
        status: data.status || "PENDING_REVIEW",
    }).returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
