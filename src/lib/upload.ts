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

interface UploadOptions {
    folder: string;
    allowedTypes?: string[];
    maxSize?: number; // in bytes
}

/**
 * Generic file upload function.
 */
export async function uploadFile(file: File, options: UploadOptions): Promise<string> {
    const { folder, allowedTypes, maxSize } = options;

    // Validate type
    if (allowedTypes && !allowedTypes.some(type => {
        if (type.endsWith("/*")) {
            const baseType = type.slice(0, -2);
            return file.type.startsWith(baseType);
        }
        return file.type === type;
    })) {
        throw new Error(`Invalid file type: ${file.type}`);
    }

    // Validate size
    if (maxSize && file.size > maxSize) {
        throw new Error(`File too large. Max size is ${maxSize / 1024 / 1024}MB`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate filename
    const extension = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.jpg');
    const filename = `${nanoid()}${extension}`;

    if (s3Client) {
        try {
            const key = `${folder}/${filename}`;

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
        const uploadDir = path.join(process.cwd(), "public/uploads", folder);
        await mkdir(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);

        // Save file
        await writeFile(filepath, buffer);

        // Return public URL path
        return `/uploads/${folder}/${filename}`;
    }
}

/**
 * Uploads a review image to storage.
 */
export async function uploadReviewImage(file: File): Promise<string> {
    return uploadFile(file, {
        folder: "reviews",
        allowedTypes: ["image/*"],
        maxSize: 5 * 1024 * 1024, // 5MB
    });
}
