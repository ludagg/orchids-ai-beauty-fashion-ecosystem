import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "rare";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const s3Client = (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY)
    ? new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    })
    : null;

/**
 * Uploads a review image to storage.
 *
 * NOTE: In a production environment, this function should:
 * 1. Use an S3-compatible storage service (AWS S3, Cloudflare R2).
 * 2. Optimize the image using a library like `sharp` (resize, compress, convert to WebP).
 *
 * If R2 credentials are provided, it uploads to Cloudflare R2.
 * Otherwise, it falls back to saving files to the local public directory.
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

    // Generate filename
    const extension = path.extname(file.name) || ".jpg";
    const filename = `${nanoid()}${extension}`;

    if (s3Client) {
        try {
            const key = `reviews/${filename}`;

            await s3Client.send(new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: file.type,
            }));

            // If R2_PUBLIC_URL is provided, use it. Otherwise, return the key.
            if (R2_PUBLIC_URL) {
                // Remove trailing slash from R2_PUBLIC_URL if present
                const publicUrl = R2_PUBLIC_URL.replace(/\/$/, "");
                return `${publicUrl}/${key}`;
            } else {
                 console.warn("R2_PUBLIC_URL is not set. Returning raw key. Image might not load.");
                 return key;
            }

        } catch (error) {
            console.error("R2 Upload Error:", error);
            throw new Error("Failed to upload to R2");
        }
    } else {
        // Fallback to local filesystem
        const uploadDir = path.join(process.cwd(), "public/uploads/reviews");
        await mkdir(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);

        // Save file
        await writeFile(filepath, buffer);

        // Return public URL path
        return `/uploads/reviews/${filename}`;
    }
}
