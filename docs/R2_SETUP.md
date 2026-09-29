# Cloudflare R2 Setup — deejpotter.com

## Overview

Cloudflare R2 provides persistent object storage for uploaded files (3D models, CAD files, etc.) that survives Render deploys. The local filesystem on Render is ephemeral — every deploy wipes it. R2 fixes that.

## How it works

- R2 is only used when all four variables below are set (`isR2Configured()` in `src/lib/r2-storage.ts`).
- **Uploads**: `saveQuoteFile` in `src/lib/db-quotes.ts` uploads to R2. If R2 isn't configured, or the upload fails, it saves to local disk instead (which Render wipes on deploy).
- **Downloads**: `readQuoteFileBuffer` tries R2 first, then falls back to local disk.
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
| Render production | Render Dashboard → deejpotter → Environment (all four set 2026-09-25) |

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
- **Integration**: `src/lib/db-quotes.ts` — `saveQuoteFile` uploads to R2 (local disk only if R2 is not configured or the upload fails); `readQuoteFileBuffer` reads from R2 first
- **Package**: `@aws-sdk/client-s3@3.1055.0` (already installed)

## Architecture decision

**2026-09-25: R2 first, local disk only as a fallback.** The original plan (2026-05-28) wrote every file to local disk and uploaded to R2 in the background. In practice the R2 upload was never wired up, and local disk on Render is wiped on every deploy. Now `saveQuoteFile` uploads to R2 before the quote is saved, and only writes to local disk when R2 isn't configured (local development) or the upload fails. Files written to disk that way don't survive a Render deploy.

**Why dynamic import instead of top-level import:**
The `@aws-sdk/client-s3` is a large dependency. Dynamic import keeps it out of the client bundle and allows the build to succeed even if the package were somehow missing.
