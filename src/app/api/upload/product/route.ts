import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/upload";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import path from "path";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { salons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateSafePathSegment } from "@/lib/path-validation";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const salonId = formData.get("salonId") as string;
    const productId = formData.get("productId") as string;
    const type = formData.get("type") as string; // 'main', 'gallery', 'variant', 'video'
    const variantColor = formData.get("variantColor") as string; // Optional, for 'variant' type

    if (!file || !salonId || !productId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      validateSafePathSegment(salonId, "salonId");
      validateSafePathSegment(productId, "productId");
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }

    // Verify salon ownership
    const salon = await db.query.salons.findFirst({
        where: eq(salons.id, salonId)
    });

    if (!salon || salon.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Determine folder and filename
    let folder = `products/${salonId}/${productId}`;
    let filename: string | undefined = undefined;

    const extension = path.extname(file.name) || (file.type === 'video/mp4' ? '.mp4' : '.jpg');

    if (type === 'main') {
        // Force filename to main.extension
        filename = `main${extension}`;
    } else if (type === 'video') {
        filename = `video${extension}`;
    } else if (type === 'gallery') {
        folder = `${folder}/gallery`;
        // Use nanoid for gallery to avoid collisions
        filename = `${nanoid()}${extension}`;
    } else if (type === 'variant') {
        if (!variantColor) {
             return NextResponse.json({ error: "Variant color is required for variant images" }, { status: 400 });
        }
        // Sanitize color name for folder path
        const safeColor = variantColor.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        folder = `${folder}/colors/${safeColor}`;
        filename = `${nanoid()}${extension}`;
    } else {
        return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    const allowedTypes = type === 'video'
        ? ["video/mp4", "video/quicktime"]
        : ["image/jpeg", "image/png", "image/webp"];

    const maxSize = type === 'video'
        ? 100 * 1024 * 1024 // 100MB for video
        : 5 * 1024 * 1024;  // 5MB for images

    const url = await uploadFile(file, {
        folder,
        allowedTypes,
        maxSize,
        filename
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Product upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
