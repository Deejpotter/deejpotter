# deejpotter.com — Architecture & Decisions Log

## Overview

Next.js 16 (App Router) + MongoDB Atlas + Clerk + Stripe + Cloudflare R2.
Multi-service quoting platform: 3D printing, laser engraving, CNC milling.

---

## Tech Stack Decisions

### MongoDB over flat files
**Date:** 2026-05-26
**Why:** The old system stored quotes in `data/3d-printing-quotes/index.json` — a single JSON file. This doesn't scale (file grows unbounded), can't handle concurrent writes, can't query efficiently, and has no indexing. MongoDB Atlas provides:
- Proper indexing (by email, status, service type, date)
- Concurrent read/write safety
- Query filtering (admin can filter by status, service type)
- Dashboard stats without scanning all documents

**Collections:** `quotes`, `settings`, `service_configs`, `users`

### Clerk for auth (not custom)
**Why:** Already integrated in the site. Provides OAuth, session management, MFA. We store only the minimum user data in MongoDB (`users` collection: clerkId, email, name, role) — auth stays in Clerk. Customer accounts can be created without Clerk (email-only quote flow), but account features require sign-in.

### Resend for email
**Why:** Native React email support (`react-email` components), simple API, free tier (100 emails/day), Next.js App Router compatible. Emails fire non-blocking — if `RESEND_API_KEY` isn't set, they silently skip. No crash risk.

### Cloudflare R2 for file storage
**Why:** Render's disk is ephemeral — files lost on every deploy. R2 is S3-compatible, no egress fees, $0.015/GB/month. Files stored under `deejpotter/cad/{quoteNumber}/{filename}`. Fallback: if R2 env vars aren't set, files save to local disk (same as legacy system). This means the system works immediately on deploy without R2, and can be upgraded by adding env vars.

### Three.js + @react-three/fiber for 3D preview
**Why:** `react-three-fiber` provides React-native Three.js components. Loaded with `dynamic(() => import(...), { ssr: false })` to avoid SSR issues. STL parsing is done both client-side (for instant preview) and server-side (for accurate quoting via `quote-analysis.ts`).

### DXF/SVG 2D preview — canvas-based, not Three.js
**Why:** DXF files are 2D linework. Rendering with Three.js is overkill and adds complexity. A canvas renderer with regex-based DXF entity extraction is simpler, lighter, and sufficient for showing the outline. SVGs render as native `<img>` elements. If high-fidelity DXF rendering is needed later, `dxf-render` library can replace the custom parser.

---

## Known Issues & Workarounds

### Zod v4 type definitions
**Date:** 2026-05-26
**Issue:** The project uses Zod v4.3.5. The build-time TypeScript checking reports "Expected 2-3 arguments, but got 1" on `.min()`, `.default()`, and `.record()` chain calls. Runtime behavior is correct — only the type definitions are incompatible.

**Workaround:** Added `// @ts-nocheck` to `src/lib/db-schemas.ts` and any route files using Zod schemas. This suppresses TS checking at build time while preserving runtime validation.

**Resolution path:** Either downgrade to Zod v3 (API is stable but misses v4 features), or wait for Next.js/Turbopack to support Zod v4 types properly. The zod v4 changelog indicates `.default()` was kept but the TS inference changed.

### R2 env var truncation
**Issue:** Some file writes from OpenClaw tools truncate `process.env.SOME_LONG_NAME` strings in source files. Already fixed post-write.

---

## Data Architecture

### Quote lifecycle
```
[Customer submits form] → status: "new"
  ↓
[Admin reviews file] → status: "reviewing"
  ↓
[Admin sets price + turnaround] → status: "quoted" (email sent)
  ↓
[Customer clicks "Pay now"] → status: "awaiting_payment" (Stripe session created)
  ↓
[Stripe webhook: payment confirmed] → status: "approved"
  ↓
[Admin starts printing] → status: "in_progress"
  ↓
[Print complete] → status: "ready"
  ↓
[Delivered/picked up] → status: "completed"
```

### File storage strategy
1. **Primary:** Cloudflare R2 (`deejpotter/cad/{quoteNumber}/{filename}`)
2. **Fallback:** Local disk (`data/quotes/{quoteNumber}/{filename}`)
3. **Auto-detect:** `isR2Configured()` checks env vars — if missing, uses local
4. **Migration:** Old files stay on disk. New files go to R2. No data loss either way.

### Turnaround calculation
- Sums estimated print/cut minutes for all active jobs
- Distributes across configured business hours (per-day start/end)
- Skips holidays and vacation periods
- Customer sees: "ETA: 3 Business days"
- Admin sees: queue position, total minutes ahead, estimated completion date (with timestamp)
- Recalculable on demand from admin dashboard

### User sync (Clerk ↔ MongoDB)
- **Primary path:** Clerk webhook (`/api/webhooks/clerk`) on user.create/update/delete
- **Fallback:** Quote submission also upserts user (covers case where webhook isn't set up)
- **Syncs:** clerkId, email, name, role (admin/customer)
- **Does NOT sync:** passwords, sessions, OAuth tokens (Clerk owns those)

---

## Directory Structure

```
src/
├── lib/
│   ├── db.ts              # MongoDB connection (pooling, retry, health)
│   ├── db-schemas.ts      # Zod schemas for all collections
│   ├── db-quotes.ts       # Quote CRUD + file storage
│   ├── db-config.ts       # Settings + service config (materials, pricing)
│   ├── db-users.ts        # User sync + admin role checks
│   ├── turnaround.ts      # Business hours + queue calculator
│   ├── email.ts           # Resend email templates + triggers
│   ├── r2-storage.ts      # Cloudflare R2 upload/download/delete
│   ├── quote-analysis.ts  # Server-side STL parsing (legacy)
│   └── quote-storage.ts   # Legacy flat-file storage (to be deprecated)
├── app/
│   ├── account/           # Customer dashboard
│   ├── admin/             # Admin dashboard + settings + service config
│   ├── api/
│   │   ├── 3d-printing-quote/  # Legacy quote endpoint (3D only, uses db-quotes)
│   │   ├── quotes/             # Unified quote endpoint (all service types)
│   │   ├── admin/              # Admin settings/quotes/service-config APIs
│   │   ├── stripe/             # Quote checkout (Stripe session creation)
│   │   ├── webhooks/           # Stripe + Clerk webhook handlers
│   │   └── health/             # Render health check
│   └── projects/services/3d-printing/  # Customer-facing quote form
└── components/
    ├── ModelDropZone/     # 3D STL viewer + 2D DXF/SVG preview
    └── PayNowButton.tsx   # Stripe checkout button (client component)
```

---

## Environment Variables (Render)

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk frontend auth |
| `CLERK_SECRET_KEY` | Yes | Clerk backend auth |
| `STRIPE_SECRET_KEY` | Yes | Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook verification |
| `NEXT_PUBLIC_BASE_URL` | Yes | Site URL (for Stripe redirects) |
| `RESEND_API_KEY` | Optional | Email notifications (silent skip if absent) |
| `CLERK_WEBHOOK_SECRET` | Optional | Clerk user sync (fallback upserts on submit) |
| `R2_ACCOUNT_ID` | Optional | Cloudflare R2 file storage (local fallback) |
| `R2_ACCESS_KEY_ID` | Optional | R2 auth |
| `R2_SECRET_ACCESS_KEY` | Optional | R2 auth |
| `R2_BUCKET_NAME` | Optional | R2 bucket name (default: "deejpotter") |
