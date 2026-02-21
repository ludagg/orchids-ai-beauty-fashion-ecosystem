import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadReviewImage } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file instanceof File) {
        try {
            const url = await uploadReviewImage(file);
            uploadedUrls.push(url);
        } catch (e) {
            console.error("Failed to upload file:", file.name, e);
            // Continue with other files or fail?
            // Let's verify we got at least one.
        }
      }
    }

    if (uploadedUrls.length === 0) {
        return NextResponse.json({ error: "No valid images uploaded" }, { status: 400 });
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
