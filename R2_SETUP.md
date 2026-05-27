# Cloudflare R2 Setup — deejpotter.com

## Overview

Cloudflare R2 provides persistent object storage for uploaded files (3D models, CAD files, etc.) that survives Render deploys. The local filesystem on Render is ephemeral — every deploy wipes it. R2 fixes that.

## How it works

- **Uploads**: Files are saved to the local filesystem AND uploaded to R2 in the background. The R2 object key is stored in the quote record.
- **Downloads**: The file download endpoint tries R2 first, falls back to local disk.
- **Bucket path**: `deejpotter/quotes/{quoteId}/{filename}`

## Prerequisites

- Cloudflare account with R2 enabled
- An R2 bucket named `deejpotter`
- R2 API tokens (S3-compatible, NOT the `cfat_` Cloudflare API token)

## Getting R2 credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → R2
2. Click **Manage R2 API Tokens**
3. Create a new token with **Object Read & Write** permissions
4. Copy:
   - **Access Key ID** → `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `R2_SECRET_ACCESS_KEY`
   - **Account ID** (from the dashboard URL or R2 overview) → `R2_ACCOUNT_ID`

## Environment variables

```env
R2_ACCOUNT_ID=1aaace17ae3d77bf7020916ddabd9352
R2_ACCESS_KEY_ID=<your-access-key-id>
R2_SECRET_ACCESS_KEY=<your-secret-access-key>
R2_BUCKET_NAME=deejpotter
```

### Where to set them

| Environment | Where |
|-------------|-------|
| Local dev | `.env` (already in `krasus/.env`) |
| Render staging | Render Dashboard → deejpotter-staging → Environment |
| Render production | Render Dashboard → deejpotter → Environment |

## Important: S3 keys vs API tokens

Cloudflare has two types of credentials:
- **`cfat_` API tokens** — for Cloudflare API management. Do NOT use these for R2 storage.
- **R2 Access Keys** (S3-compatible) — `c15b7...` format. These are what you need.

The S3 SDK does not understand `cfat_` tokens. It needs the Access Key ID + Secret Access Key pair.

## Current credentials

Stored in `C:\Users\Deej\repos\krasus\.env` under the Cloudflare R2 section:
- Account ID: `1aaace17ae3d77bf7020916ddabd9352`
- Keys saved in Vaultwarden as backup

## Code

- **Module**: `src/lib/r2-storage.ts` — dynamic-import wrapper around `@aws-sdk/client-s3`
- **Integration**: `src/lib/quote-storage.ts` — calls R2 on upload, serves from R2 on download
- **Package**: `@aws-sdk/client-s3@3.1055.0` (already installed)

## Architecture decision (2026-05-28)

**Why dual-write (local + R2) instead of R2-only:**
1. Local write is instant — doesn't add latency to the quote submission
2. R2 upload runs in the background — failure doesn't block the user
3. Local files work as cache — if R2 is temporarily unavailable, downloads still work
4. Dual-write gives us zero-downtime migration from the old flat-file system

**Why dynamic import instead of top-level import:**
The `@aws-sdk/client-s3` is a large dependency. Dynamic import keeps it out of the client bundle and allows the build to succeed even if the package were somehow missing.
