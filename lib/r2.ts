import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client configured for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "school-system";

// File type validations
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB

function buildPublicUrl(key: string) {
  const publicBase = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "").replace(/\/$/, "")
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
  if (!publicBase) return null

  return `${publicBase}/${encodedKey}`
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : String(error || fallback)
}

/**
 * Upload an image file to R2
 * @param file - File to upload
 * @param folder - Folder path in R2 (e.g., "teachers/123", "events")
 * @returns Upload response with URL
 */
export async function uploadImage(
  file: File,
  folder: string
): Promise<UploadResponse> {
  try {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Invalid image type. Allowed: JPEG, PNG, WebP",
      };
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: `Image too large. Max size: 5MB`,
      };
    }

    const buffer = await file.arrayBuffer();
    const key = `${folder}/${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      Metadata: {
        "uploaded-at": new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    // Generate public URL
    const publicUrl = buildPublicUrl(key);
    if (!publicUrl) {
      return {
        success: false,
        error: "CLOUDFLARE_R2_PUBLIC_URL is not configured",
      }
    }

    return {
      success: true,
      url: publicUrl,
      key,
    };
  } catch (error) {
    console.error("R2 upload error:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to upload image to R2"),
    };
  }
}

/**
 * Upload a document file to R2
 * @param file - File to upload
 * @param folder - Folder path in R2 (e.g., "teachers/123/documents")
 * @returns Upload response with URL
 */
export async function uploadDocument(
  file: File,
  folder: string
): Promise<UploadResponse> {
  try {
    // Validate file type
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Invalid document type. Allowed: PDF, DOC, DOCX",
      };
    }

    // Validate file size
    if (file.size > MAX_DOCUMENT_SIZE) {
      return {
        success: false,
        error: `Document too large. Max size: 50MB`,
      };
    }

    const buffer = await file.arrayBuffer();
    const key = `${folder}/${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      Metadata: {
        "uploaded-at": new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    // Generate public URL
    const publicUrl = buildPublicUrl(key);
    if (!publicUrl) {
      return {
        success: false,
        error: "CLOUDFLARE_R2_PUBLIC_URL is not configured",
      }
    }

    return {
      success: true,
      url: publicUrl,
      key,
    };
  } catch (error) {
    console.error("R2 upload error:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to upload document to R2"),
    };
  }
}

/**
 * Delete a file from R2
 * @param key - R2 object key
 */
export async function deleteFile(key: string): Promise<UploadResponse> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return {
      success: true,
    };
  } catch (error) {
    console.error("R2 delete error:", error);
    return {
      success: false,
      error: "Failed to delete file from R2",
    };
  }
}

/**
 * Generate a signed URL for temporary access
 * @param key - R2 object key
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn,
    });

    return url;
  } catch (error) {
    console.error("R2 signed URL error:", error);
    throw error;
  }
}

export { s3Client };
