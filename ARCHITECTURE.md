# deejpotter.com — Architecture & Decisions Log

## Overview

Next.js 16 (App Router) + MongoDB Atlas + Clerk + Stripe + Cloudflare R2.
Multi-service quoting platform: 3D printing, laser engraving (engraving only, no cutting), CNC milling. The public quote form handles 3D printing; laser and milling jobs come in through the contact form for now.

---

## Tech Stack Decisions

### MongoDB over flat files
**Date:** 2026-05-26
**Why:** The old system stored quotes in `data/3d-printing-quotes/index.json` — a single JSON file. This doesn't scale (file grows unbounded), can't handle concurrent writes, can't query efficiently, and has no indexing. MongoDB Atlas provides:
- Proper indexing (by email, status, service type, date)
- Concurrent read/write safety
- Query filtering (admin can filter by status, service type)
- Dashboard stats without scanning all documents

**Collections:** `quotes`, `settings`, `service_configs`, `users`, `contact_leads`, `grocery_orders`

**2026-09-25:** Contact leads and grocery orders moved off local JSON files into MongoDB too (Render's disk is wiped on every deploy). Indexes are created by `ensureIndexes()` on the first `getCollection()` call in each process.

**2026-09-26:** `service_configs` (3d_printing) is the source of truth for 3D printing materials and prices. See "Rendering and caching" below.

### Databases: one cluster, one database per environment
**Date:** 2026-09-26
**Why:** Local development used to read and write the site's own database, because `.env` pointed at it. Each environment now has its own database on the same Atlas cluster (`cluster0.adstw`), chosen with `DB_NAME` (`src/lib/db.ts`, default `deejpotter`):

| Environment | `DB_NAME` | Notes |
|---|---|---|
| Production (Render `deejpotter`) | `deejpotter` | The site's data |
| Local development | `deejpotter_dev` | Set in the gitignored `.env`; refresh from `deejpotter` with mongosh (see readme) |
| Staging (Render `deejpotter-staging`) | not yet separated | Uses whatever its Render env sets; separating it (`deejpotter_staging`) is a TODO |

All data is test data so far. The databases share one Atlas user, so a local script could still reach `deejpotter` by changing `DB_NAME`. A dev-only Atlas user limited to `deejpotter_dev` would close that off (TODO).

### Admins from an environment variable
**Date:** 2026-09-25
**Why:** Admin access is a server setting, not user data. `isAdminUser()` in `src/lib/admin-auth.ts` checks the signed-in Clerk user ID against `ADMIN_USER_IDS` (comma-separated). Nothing in the app or database can grant or remove admin access. This replaced a MongoDB role, which a bug in `upsertUser` reset to "customer" on every quote submission, and a Clerk `publicMetadata.role` fallback.

### Clerk for auth (not custom)
**Why:** Already integrated in the site. Provides OAuth, session management, MFA. We store only the minimum user data in MongoDB (`users` collection: clerkId, email, name, role) — auth stays in Clerk. Customer accounts can be created without Clerk (email-only quote flow), but account features require sign-in.

### Resend for email
**Why:** Native React email support (`react-email` components), simple API, free tier (100 emails/day), Next.js App Router compatible. Emails fire non-blocking. If `RESEND_API_KEY` isn't set, they skip with a log line, so nothing crashes.

Only quotes send email: `notifyQuoteReceived` (new quote, to the customer and `ADMIN_EMAIL`) and `notifyQuoteUpdated` (admin changes a quote). Contact form messages are saved to MongoDB and shown at `/admin/leads` but don't send email. Emails come from `EMAIL_FROM` (default `Deej Potter <noreply@deejpotter.com>`), so deejpotter.com has to be verified in Resend.

**2026-09-25:** `RESEND_API_KEY` set on both Render services.

### Cloudflare R2 for file storage
**Why:** Render's disk is ephemeral — files lost on every deploy. R2 is S3-compatible, no egress fees, $0.015/GB/month. Files stored under `deejpotter/cad/{quoteNumber}/{filename}`. Fallback: if R2 env vars aren't set, files save to local disk (same as legacy system). This means the system works immediately on deploy without R2, and can be upgraded by adding env vars.

### Three.js + @react-three/fiber for 3D preview
**Why:** `react-three-fiber` provides React-native Three.js components. Loaded with `dynamic(() => import(...), { ssr: false })` to avoid SSR issues. STL parsing is done both client-side (for instant preview) and server-side (for accurate quoting via `quote-analysis.ts`).

### DXF/SVG 2D preview — canvas-based, not Three.js
**Why:** DXF files are 2D linework. Rendering with Three.js is overkill and adds complexity. A canvas renderer with regex-based DXF entity extraction is simpler, lighter, and sufficient for showing the outline. SVGs render as native `<img>` elements. If high-fidelity DXF rendering is needed later, `dxf-render` library can replace the custom parser.

### Rendering and caching: static by default
**Why:** Almost every public page's content ships with the code (page copy, `src/content`, markdown blog posts, `config/printing-materials.json`), so it only changes on deploy. Static generation at build time is the fastest option and needs no cache rules. ISR would only add regeneration work for content that can't change between deploys.

- **Static (default):** marketing pages, tools, blog list, and blog posts (`generateStaticParams` + `dynamicParams = false`, so unknown slugs 404 at build).
- **Dynamic:** pages that depend on the request — admin (auth), account (per user), sign-in/up, and Stripe return pages (`searchParams`).
- **Client data:** tool pages and the quote status lookup fetch their own data in the browser.
- **When to use ISR:** when a *public* page reads data that changes without a deploy (MongoDB). Render it on the server with `export const revalidate = <seconds>` as a safety net, and call `revalidatePath()` from the admin API that changes the data so edits appear immediately.
- **In use:** the 3D printing page is ISR (`revalidate = 3600`). It reads enabled materials and prices from the MongoDB service config, and the admin service-config API calls `revalidatePath()` on save. The quote API validates and prices against the same config. If the database is unreachable at build or regeneration, the page falls back to `config/printing-materials.json`.
- **Seeding (2026-09-26):** the JSON materials seed the MongoDB config once (`materialsSeeded` flag), so materials removed in admin don't come back. Quality/infill presets and the hourly rate still come from the JSON file.

**Next.js 16 conventions:** route `params` and `searchParams` are Promises and must be awaited. Page metadata must be exported from `page.tsx` or `layout.tsx` (client-component pages use a pass-through `layout.tsx`); the root template appends "| Deej Potter", so page titles don't include it.

### Design system: brand gradients as accents
**Date:** 2026-09-26
**Why:** Large gradient fills read as dated and hurt legibility (the old see-through dropdown showed the page behind its links). The brand green (`#1E9952`) and info blue (`#59B7CC`) are used as accents instead: glows behind the hero, thin accent lines, gradient text on a key phrase, and one gradient primary button per section. Utilities live in `src/styles/globals.css` and are documented in `.github/GRADIENT-GUIDE.md`. Motion is short (about 150 to 200ms) and turned off for `prefers-reduced-motion`.

- **Navbar:** sticky 56px header, logo top-left, links beside it, theme and auth on the right. The dropdown panel is absolutely positioned inside the header (not `fixed`), so it moves with the header and can't float over the page after scrolling.
- **Spacing:** one step tighter than the original design so full pages fit on medium screens: 16px body text, page titles `text-3xl`/`sm:text-4xl`, sections `py-10`, cards `p-5`. Prefer these sizes over larger ones for new sections.

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
- **Syncs:** clerkId, email, name (a `role` field defaults to "customer" but is not used for access)
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
│   ├── db-users.ts        # User sync
│   ├── turnaround.ts      # Business hours + queue calculator
│   ├── email.ts           # Resend email templates + triggers
│   ├── r2-storage.ts      # Cloudflare R2 upload/download/delete
│   ├── contact-leads.ts   # Contact form messages (MongoDB)
│   ├── admin-auth.ts      # ADMIN_USER_IDS check
│   └── quote-analysis.ts  # Server-side STL parsing
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
| `DB_NAME` | Optional | Database name (default `deejpotter`; local `.env` uses `deejpotter_dev`) |
| `NODE_VERSION` | Yes (Render) | Node.js version Render installs (`24`); overrides `.nvmrc` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk frontend auth |
| `CLERK_SECRET_KEY` | Yes | Clerk backend auth |
| `STRIPE_SECRET_KEY` | Yes | Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook verification |
| `NEXT_PUBLIC_BASE_URL` | Yes | Site URL (for Stripe redirects) |
| `ADMIN_USER_IDS` | Yes | Clerk user IDs allowed into `/admin` (comma-separated) |
| `RESEND_API_KEY` | Optional | Quote emails (skipped with a log line if absent) |
| `EMAIL_FROM` | Optional | Sender address (default `Deej Potter <noreply@deejpotter.com>`) |
| `ADMIN_EMAIL` | Optional | Where admin notifications go (default `deejpotter@gmail.com`) |
| `CLERK_WEBHOOK_SECRET` | Optional | Clerk user sync (fallback upserts on submit) |
| `R2_ACCOUNT_ID` | Optional | Cloudflare R2 file storage (local fallback) |
| `R2_ACCESS_KEY_ID` | Optional | R2 auth |
| `R2_SECRET_ACCESS_KEY` | Optional | R2 auth |
| `R2_BUCKET_NAME` | Optional | R2 bucket name (default: "deejpotter") |
| `NEXT_PUBLIC_API_URL` | Optional | Backend for the box shipping calculator's items. Unset on both services, so the calculator shows "item database isn't connected" |

### Contact form endpoint
The contact form always posts to its own `/api/contact`. It used to honour `NEXT_PUBLIC_CONTACT_ENDPOINT` / `NEXT_PUBLIC_BACKEND_URL`, and a leftover value sent submissions to another address, which Chrome blocked with a local network permission prompt. Those variables are no longer read and can be deleted from Render.
