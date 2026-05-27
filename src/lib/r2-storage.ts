/**
 * r2-storage.ts — Cloudflare R2 object storage for CAD files
 *
 * Replaces local disk storage with persistent cloud storage.
 * R2 is S3-compatible, so we use the AWS SDK with a custom endpoint.
 *
 * Directory structure: deejpotter/cad/{quoteNumber}/{filename}
 *
 * Requires env vars:
 *   R2_ACCOUNT_ID       — Cloudflare account ID
 *   R2_ACCESS_KEY_ID    — R2 access key
 *   R2_SECRET_ACCESS_KEY — R2 secret key
 *   R2_BUCKET_NAME      — bucket name (create via Cloudflare dashboard)
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const CAD_PREFIX = "deejpotter/cad";

function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKey || !secretKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  });
}

function getBucket(): string {
  return process.env.R2_BUCKET_NAME || "deejpotter";
}

function storageKey(quoteNumber: number, fileName: string): string {
  return `${CAD_PREFIX}/${quoteNumber}/${fileName}`;
}

/**
 * Upload a file buffer to R2.
 * Returns the storage key on success, or null if R2 is not configured.
 */
export async function uploadToR2(
  quoteNumber: number,
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ key: string; bucket: string } | null> {
  const client = getR2Client();
  if (!client) return null;

  const bucket = getBucket();
  const key = storageKey(quoteNumber, fileName);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
      ContentDisposition: `attachment; filename="${fileName}"`,
      Metadata: {
        quoteNumber: String(quoteNumber),
        uploadedAt: new Date().toISOString(),
      },
    }),
  );

  console.log(`[r2] Uploaded: ${key} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return { key, bucket };
}

/**
 * Generate a pre-signed URL for downloading a file.
 * Valid for the specified number of seconds (default: 1 hour for admin, 15 min for customer).
 */
export async function getDownloadUrl(
  quoteNumber: number,
  fileName: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const client = getR2Client();
  if (!client) return null;

  const bucket = getBucket();
  const key = storageKey(quoteNumber, fileName);

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete a file from R2.
 */
export async function deleteFromR2(
  quoteNumber: number,
  fileName: string,
): Promise<boolean> {
  const client = getR2Client();
  if (!client) return false;

  const bucket = getBucket();
  const key = storageKey(quoteNumber, fileName);

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  console.log(`[r2] Deleted: ${key}`);
  return true;
}

/**
 * Check if R2 is configured and accessible.
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  );
}
