import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/upload";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
    const type = formData.get("type") as string; // 'image' or 'document'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    let folder = "partners";
    let allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    let maxSize = 10 * 1024 * 1024; // 10MB

    if (type === "document") {
        folder = "partners/docs";
        allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // ID can be image
    } else {
        folder = "partners/images";
        allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    }

    const url = await uploadFile(file, {
        folder,
        allowedTypes,
        maxSize
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
