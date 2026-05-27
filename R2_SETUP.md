# Cloudflare R2 — Setup Guide

## Credential types

Cloudflare has TWO kinds of credentials — they are NOT interchangeable:

| Type | Prefix | Used for |
|---|---|---|
| API Token | `cfat_...` | REST API (create buckets, manage tokens) |
| R2 Access Key | random string | S3-compatible file read/write from apps |

**The app needs R2 Access Keys** (S3-compatible), NOT the API token.

## Creating R2 Access Keys

1. Go to [Cloudflare dashboard → R2](https://dash.cloudflare.com/1aaace17ae3d77bf7020916ddabd9352/r2)
2. "Manage R2 API Tokens" → "Create API Token"
3. Permissions: **Object Read & Write**
4. Name: `deejpotter-storage`
5. Copy Access Key ID + Secret Access Key (Secret only shown once!)

## Env vars (add to Render dashboard)

```
R2_ACCOUNT_ID=1aaace17ae3d77bf7020916ddabd9352
R2_ACCESS_KEY_ID=<from R2 API token above>
R2_SECRET_ACCESS_KEY=<from R2 API token above>
R2_BUCKET_NAME=deejpotter
```

## Bucket

Create a bucket named `deejpotter` in the R2 dashboard. Files will be stored at:
```
deejpotter/cad/{quoteNumber}/{filename}
```

## Fallback

If R2 env vars are missing, the system falls back to local disk storage.
No crash, no data loss — just non-persistent across deploys.
