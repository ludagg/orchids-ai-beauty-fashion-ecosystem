import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

/**
 * Uploads a review image to storage.
 *
 * NOTE: In a production environment, this function should:
 * 1. Use an S3-compatible storage service (AWS S3, Cloudflare R2).
 * 2. Optimize the image using a library like `sharp` (resize, compress, convert to WebP).
 *
 * Since this environment lacks S3 credentials and binary dependencies like sharp,
 * we are simulating the behavior by saving files to the local public directory.
 * This provides a functional MVP for development and testing.
 */
export async function uploadReviewImage(file: File): Promise<string> {
    // Input validation
    if (!file.type.startsWith("image/")) {
        throw new Error("Invalid file type");
    }

    // Size limit (5MB) - enforced here as a safeguard
    if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Setup upload directory
    const uploadDir = path.join(process.cwd(), "public/uploads/reviews");
    await mkdir(uploadDir, { recursive: true });

    // Generate filename
    const extension = path.extname(file.name) || ".jpg";
    // Sanitize filename and use nanoid for uniqueness
    const filename = `${nanoid()}${extension}`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return public URL path
    return `/uploads/reviews/${filename}`;
}
