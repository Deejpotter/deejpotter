/**
 * r2-storage.ts — Cloudflare R2 object storage for CAD files
 *
 * Uses dynamic imports for @aws-sdk/client-s3 so the build doesn't
 * fail if the package hasn't been installed yet. R2 is optional —
 * when not configured, files fall back to local disk storage.
 */

const CAD_PREFIX = "deejpotter/cad";

// ─── Helpers ────────────────────────────────────────────────────────

function isConfigured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  );
}

function getBucket(): string {
  return process.env.R2_BUCKET_NAME || "deejpotter";
}

function storageKey(quoteNumber: number, fileName: string): string {
  return `${CAD_PREFIX}/${quoteNumber}/${fileName}`;
}

async function getS3Client() {
  if (!isConfigured()) return null;
  try {
    const { S3Client } = await import("@aws-sdk/client-s3");
    return new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    });
  } catch (err) {
    console.warn("[r2] AWS SDK not installed — R2 storage unavailable");
    return null;
  }
}

// ─── Public API ─────────────────────────────────────────────────────

export async function uploadToR2(
  quoteNumber: number,
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ key: string; bucket: string } | null> {
  const client = await getS3Client();
  if (!client) return null;

  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
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

export async function getDownloadUrl(
  quoteNumber: number,
  fileName: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const client = await getS3Client();
  if (!client) return null;

  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
  const bucket = getBucket();
  const key = storageKey(quoteNumber, fileName);

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

export async function deleteFromR2(
  quoteNumber: number,
  fileName: string,
): Promise<boolean> {
  const client = await getS3Client();
  if (!client) return false;

  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
  const bucket = getBucket();
  const key = storageKey(quoteNumber, fileName);

  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log(`[r2] Deleted: ${key}`);
  return true;
}

// Re-export isR2Configured for the old import path used by db-quotes
export { isConfigured as isR2Configured };
