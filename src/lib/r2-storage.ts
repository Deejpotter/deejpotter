/**
 * r2-storage.ts — Cloudflare R2 file storage via S3-compatible API
 *
 * Uses dynamic imports so the build doesn't fail when @aws-sdk/client-s3
 * is unavailable. All R2 operations return null on failure so callers can
 * fall back to local filesystem storage.
 *
 * Required env vars:
 *   R2_ACCOUNT_ID       — Cloudflare account ID
 *   R2_ACCESS_KEY_ID     — R2 access key (S3-compatible, NOT the cfat_ API token)
 *   R2_SECRET_ACCESS_KEY — R2 secret access key
 *   R2_BUCKET_NAME       — bucket name (e.g. "deejpotter")
 *   R2_ENDPOINT          — optional, defaults to <account_id>.r2.cloudflarestorage.com
 */

const QUOTE_PREFIX = "quotes/";

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return null;
  }

  return {
    region: "auto",
    endpoint:
      process.env.R2_ENDPOINT ||
      `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    bucketName,
  };
}

/** Returns true if all R2 env vars are configured */
export function isR2Configured(): boolean {
  return getR2Config() !== null;
}

/**
 * Upload a file to R2.
 * Returns the R2 object key on success, null on failure.
 */
export async function uploadToR2(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  quoteId: string
): Promise<string | null> {
  const config = getR2Config();
  if (!config) return null;

  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    const client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: config.credentials,
      forcePathStyle: true,
    });

    const key = `${QUOTE_PREFIX}${quoteId}/${fileName}`;

    await client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    console.info("r2: uploaded", { key, size: buffer.length });
    return key;
  } catch (error) {
    console.error("r2: upload failed", error);
    return null;
  }
}

/**
 * Download a file from R2.
 * Returns the file body as a Buffer on success, null on failure.
 */
export async function downloadFromR2(key: string): Promise<Buffer | null> {
  const config = getR2Config();
  if (!config) return null;

  try {
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");

    const client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: config.credentials,
      forcePathStyle: true,
    });

    const response = await client.send(
      new GetObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      })
    );

    // Use the SDK's built-in stream-to-byte-array method
    if (!response.Body) {
      console.warn("r2: empty response body for", key);
      return null;
    }

    const bodyBytes = await response.Body.transformToByteArray();
    const buffer = Buffer.from(bodyBytes);

    console.info("r2: downloaded", { key, size: buffer.length });
    return buffer;
  } catch (error) {
    console.error("r2: download failed", error);
    return null;
  }
}

/**
 * Delete a file from R2.
 * Returns true on success, false on failure.
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  const config = getR2Config();
  if (!config) return false;

  try {
    const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");

    const client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: config.credentials,
      forcePathStyle: true,
    });

    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      })
    );

    console.info("r2: deleted", { key });
    return true;
  } catch (error) {
    console.error("r2: delete failed", error);
    return false;
  }
}

/**
 * Build the R2 key for a quote file.
 */
export function getR2Key(quoteId: string, fileName: string): string {
  return `${QUOTE_PREFIX}${quoteId}/${fileName}`;
}
